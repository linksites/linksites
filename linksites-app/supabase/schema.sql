create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null,
  bio text not null default '',
  avatar_url text,
  theme_slug text not null default 'midnight-grid' references public.themes(slug),
  is_published boolean not null default false,
  followers_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint followers_count_nonnegative check (followers_count >= 0),
  constraint username_length check (char_length(username) between 3 and 32),
  constraint username_format check (username ~ '^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$')
);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  url text not null,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint title_length check (char_length(title) between 1 and 80),
  constraint url_format check (url ~* '^https?://')
);

create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  followed_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (follower_id, followed_id)
);

create or replace function public.sync_profile_followers_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.follower_id = new.followed_id then
      raise exception 'profiles cannot follow themselves';
    end if;

    update public.profiles
    set followers_count = followers_count + 1
    where id = new.followed_id;

    return new;
  end if;

  if tg_op = 'DELETE' then
    update public.profiles
    set followers_count = greatest(followers_count - 1, 0)
    where id = old.followed_id;

    return old;
  end if;

  return null;
end;
$$;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Table for user presence (e.g., last seen, online status)
create table if not exists public.user_presence (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  last_seen timestamptz not null default timezone('utc', now()),
  status text default 'offline', -- e.g., 'online', 'offline', 'away'
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Table for chat rooms (for group chats)
create table if not exists public.chat_rooms (
  id uuid primary key default gen_random_uuid(),
  name text, -- Nome do grupo (opcional para DMs)
  is_group_chat boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Table for participants in chat rooms
create table if not exists public.chat_room_participants (
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default timezone('utc', now()),
  primary key (room_id, profile_id)
);

-- Table for messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null, -- e.g., 'like', 'heart', 'emoji_id'
  created_at timestamptz not null default timezone('utc', now()),
  unique (post_id, user_id, type) -- Garante que um usuário não reaja com o mesmo tipo no mesmo post
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null, -- Quem gerou a notificação (pode ser nulo se for do sistema)
  type text not null, -- e.g., 'new_follower', 'post_reaction', 'new_post_from_followed'
  entity_id uuid, -- ID da entidade relacionada (e.g., post_id, follow_id)
  read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);




create trigger posts_set_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null,
  session_id text not null,
  link_id uuid,
  link_title text,
  path text,
  referrer text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint analytics_event_type check (event_type in ('profile_view', 'link_click')),
  constraint analytics_session_length check (char_length(session_id) between 8 and 120)
);

create index if not exists links_profile_id_position_idx
  on public.links(profile_id, position);
create index if not exists analytics_events_profile_created_idx
  on public.analytics_events(profile_id, created_at desc);
create index if not exists analytics_events_profile_type_created_idx
  on public.analytics_events(profile_id, event_type, created_at desc);
create index if not exists analytics_events_profile_session_idx
  on public.analytics_events(profile_id, session_id);

drop trigger if exists themes_set_updated_at on public.themes;
drop trigger if exists profiles_set_updated_at on public.profiles;
drop trigger if exists links_set_updated_at on public.links;
drop trigger if exists follows_sync_followers_count on public.follows;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger links_set_updated_at
before update on public.links
for each row
execute function public.set_updated_at();

create trigger follows_sync_followers_count
after insert or delete on public.follows
for each row
execute function public.sync_profile_followers_count();

update public.profiles as profile
set followers_count = counts.followers_count
from (
  select
    profiles.id,
    coalesce(count(follows.followed_id), 0)::integer as followers_count
  from public.profiles
  left join public.follows on follows.followed_id = profiles.id
  group by profiles.id
) as counts
where profile.id = counts.id;

insert into public.themes (slug, name, config)
values
  (
    'midnight-grid',
    'Midnight Grid',
    jsonb_build_object(
      'background', 'linear-gradient(180deg, #06111f 0%, #0a1830 100%)',
      'panel', 'rgba(9, 20, 38, 0.84)',
      'text', '#eff7ff',
      'muted', 'rgba(239, 247, 255, 0.64)',
      'accent', '#67f7ef'
    )
  ),
  (
    'sunset-signal',
    'Sunset Signal',
    jsonb_build_object(
      'background', 'linear-gradient(180deg, #140c12 0%, #2b1024 100%)',
      'panel', 'rgba(35, 13, 29, 0.84)',
      'text', '#fff6f8',
      'muted', 'rgba(255, 246, 248, 0.68)',
      'accent', '#ff7d66'
    )
  )
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.themes enable row level security;
alter table public.profiles enable row level security;
alter table public.follows enable row level security;
alter table public.posts enable row level security;
alter table public.user_presence enable row level security;
alter table public.chat_rooms enable row level security;
alter table public.chat_room_participants enable row level security;
alter table public.reactions enable row level security;
alter table public.notifications enable row level security;
alter table public.links enable row level security;
alter table public.analytics_events enable row level security;

drop policy if exists "themes are readable by everyone" on public.themes;
create policy "themes are readable by everyone"
on public.themes
for select
using (true);

drop policy if exists "owners can read their own profiles" on public.profiles;
create policy "owners can read their own profiles"
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "owners can insert their own profiles" on public.profiles;
create policy "owners can insert their own profiles"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "owners can update their own profiles" on public.profiles;
create policy "owners can update their own profiles"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "published profiles are readable by everyone" on public.profiles;
create policy "published profiles are readable by everyone"
on public.profiles
for select
using (is_published = true);

drop policy if exists "owners can manage their own links" on public.links;
create policy "owners can manage their own links"
on public.links
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where public.profiles.id = public.links.profile_id
      and public.profiles.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where public.profiles.id = public.links.profile_id
      and public.profiles.user_id = auth.uid()
  )
);

drop policy if exists "active links from published profiles are readable by everyone" on public.links;
create policy "active links from published profiles are readable by everyone"
on public.links
for select
using (
  is_active = true
  and exists (
    select 1
    from public.profiles
    where public.profiles.id = public.links.profile_id
      and public.profiles.is_published = true
  )
);

drop policy if exists "owners can read their own analytics" on public.analytics_events;
create policy "owners can read their own analytics"
on public.analytics_events
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where public.profiles.id = public.analytics_events.profile_id
      and public.profiles.user_id = auth.uid()
  )
);

drop policy if exists "public can write analytics for published profiles" on public.analytics_events;
create policy "public can write analytics for published profiles"
on public.analytics_events
for insert
with check (
  exists (
    select 1
    from public.profiles
    where public.profiles.id = public.analytics_events.profile_id
      and public.profiles.is_published = true
  )
);

-- Policies for 'follows' table
drop policy if exists "users can view their own follows and followers" on public.follows;
create policy "users can view their own follows and followers"
on public.follows
for select
to authenticated
using (
  auth.uid() = (select user_id from public.profiles where id = follower_id)
  or auth.uid() = (select user_id from public.profiles where id = followed_id)
);

drop policy if exists "authenticated users can follow others" on public.follows;
create policy "authenticated users can follow others"
on public.follows
for insert
to authenticated
with check (
  auth.uid() = (select user_id from public.profiles where id = follower_id)
);

drop policy if exists "authenticated users can unfollow others" on public.follows;
create policy "authenticated users can unfollow others"
on public.follows
for delete
to authenticated
using (
  auth.uid() = (select user_id from public.profiles where id = follower_id)
);

-- Policies for 'posts' table
drop policy if exists "posts are readable by everyone" on public.posts;
create policy "posts are readable by everyone"
on public.posts
for select
using (true); -- Or restrict to published profiles if desired: (select is_published from public.profiles where id = user_id) = true

drop policy if exists "owners can create their own posts" on public.posts;
create policy "owners can create their own posts"
on public.posts
for insert
to authenticated
with check (auth.uid() = (select user_id from public.profiles where id = user_id));

drop policy if exists "owners can update their own posts" on public.posts;
create policy "owners can update their own posts"
on public.posts
for update
to authenticated
using (auth.uid() = (select user_id from public.profiles where id = user_id));

drop policy if exists "owners can delete their own posts" on public.posts;
create policy "owners can delete their own posts"
on public.posts
for delete
to authenticated
using (auth.uid() = (select user_id from public.profiles where id = user_id));

-- Policies for 'user_presence' table
drop policy if exists "users can view user presence" on public.user_presence;
create policy "users can view user presence"
on public.user_presence
for select
using (true); -- Ou mais restritivo: exists (select 1 from public.follows where follower_id = auth.uid() and followed_id = user_id)

drop policy if exists "owners can update their own presence" on public.user_presence;
create policy "owners can update their own presence"
on public.user_presence
for update
to authenticated
using (auth.uid() = (select user_id from public.profiles where id = user_id));

drop policy if exists "owners can insert their own presence" on public.user_presence;
create policy "owners can insert their own presence"
on public.user_presence
for insert
to authenticated
with check (auth.uid() = (select user_id from public.profiles where id = user_id));

-- Policies for 'chat_rooms' table
drop policy if exists "authenticated users can view their chat rooms" on public.chat_rooms;
create policy "authenticated users can view their chat rooms"
on public.chat_rooms
for select
to authenticated
using (
  exists (
    select 1
    from public.chat_room_participants
    where chat_room_participants.room_id = chat_rooms.id
      and chat_room_participants.profile_id = (select id from public.profiles where user_id = auth.uid())
  )
);

drop policy if exists "authenticated users can create chat rooms" on public.chat_rooms;
create policy "authenticated users can create chat rooms"
on public.chat_rooms
for insert
to authenticated
with check (true); -- A lógica de quem pode criar um grupo ou DM será controlada na aplicação.

-- Policies for 'chat_room_participants' table
drop policy if exists "authenticated users can view their chat room participants" on public.chat_room_participants;
create policy "authenticated users can view their chat room participants"
on public.chat_room_participants
for select
to authenticated
using (
  exists (
    select 1
    from public.chat_room_participants as p
    where p.room_id = chat_room_participants.room_id
      and p.profile_id = (select id from public.profiles where user_id = auth.uid())
  )
);

drop policy if exists "authenticated users can add themselves to chat rooms" on public.chat_room_participants;
create policy "authenticated users can add themselves to chat rooms"
on public.chat_room_participants
for insert
to authenticated
with check (profile_id = (select id from public.profiles where user_id = auth.uid()));

-- Policies for 'reactions' table
drop policy if exists "reactions are readable by everyone" on public.reactions;
create policy "reactions are readable by everyone"
on public.reactions
for select
using (
  -- Permite ver reações de posts públicos
  exists (
    select 1
    from public.posts
    where public.posts.id = public.reactions.post_id
      and public.posts.user_id = (select id from public.profiles where is_published = true)
  )
  -- Ou permite ver suas próprias reações em qualquer post
  or auth.uid() = (select user_id from public.profiles where id = public.reactions.user_id)
);

drop policy if exists "authenticated users can create reactions" on public.reactions;
create policy "authenticated users can create reactions"
on public.reactions
for insert
to authenticated
with check (auth.uid() = (select user_id from public.profiles where id = public.reactions.user_id));

-- Não permitimos UPDATE em reações (geralmente é DELETE + INSERT para mudar o tipo)

drop policy if exists "owners can delete their own reactions" on public.reactions;
create policy "owners can delete their own reactions"
on public.reactions
for delete
to authenticated
using (auth.uid() = (select user_id from public.profiles where id = public.reactions.user_id));

-- Policies for 'notifications' table
drop policy if exists "owners can view their own notifications" on public.notifications;
create policy "owners can view their own notifications"
on public.notifications
for select
to authenticated
using (auth.uid() = (select user_id from public.profiles where id = public.notifications.recipient_id));

-- INSERT para notificações é geralmente feito por funções/triggers do banco ou service_role.
-- Se for permitido ao usuário autenticado criar suas próprias (cenário menos comum), seria:
-- drop policy if exists "owners can create their own notifications" on public.notifications;
-- create policy "owners can create their own notifications"
-- on public.notifications
-- for insert
-- to authenticated
-- with check (auth.uid() = (select user_id from public.profiles where id = public.notifications.recipient_id));

drop policy if exists "owners can update their own notifications" on public.notifications;
create policy "owners can update their own notifications"
on public.notifications
for update
to authenticated
using (auth.uid() = (select user_id from public.profiles where id = public.notifications.recipient_id));

drop policy if exists "owners can delete their own notifications" on public.notifications;
create policy "owners can delete their own notifications"
on public.notifications
for delete
to authenticated
using (auth.uid() = (select user_id from public.profiles where id = public.notifications.recipient_id));

-- Policies for 'messages' table
drop policy if exists "authenticated users can view messages in their chat rooms" on public.messages;
create policy "authenticated users can view messages in their chat rooms"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.chat_room_participants
    where chat_room_participants.room_id = messages.room_id
      and chat_room_participants.profile_id = (select id from public.profiles where user_id = auth.uid())
  )
);

drop policy if exists "authenticated users can send messages to their chat rooms" on public.messages;
create policy "authenticated users can send messages to their chat rooms"
on public.messages
for insert
to authenticated
with check (
  sender_id = (select id from public.profiles where user_id = auth.uid())
  and exists (
    select 1
    from public.chat_room_participants
    where chat_room_participants.room_id = messages.room_id
      and chat_room_participants.profile_id = (select id from public.profiles where user_id = auth.uid())
  )
);

drop policy if exists "avatar images are readable by everyone" on storage.objects;
create policy "avatar images are readable by everyone"
on storage.objects
for select
using (bucket_id = 'avatars');

drop policy if exists "users can upload their own avatar images" on storage.objects;
create policy "users can upload their own avatar images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "users can update their own avatar images" on storage.objects;
create policy "users can update their own avatar images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "users can delete their own avatar images" on storage.objects;
create policy "users can delete their own avatar images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
