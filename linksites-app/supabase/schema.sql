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
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
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

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger links_set_updated_at
before update on public.links
for each row
execute function public.set_updated_at();

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
