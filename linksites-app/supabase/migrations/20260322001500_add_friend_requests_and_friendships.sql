begin;

create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint friend_requests_status_check check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  constraint friend_requests_distinct_profiles check (sender_id <> recipient_id)
);

create unique index if not exists friend_requests_pending_unique_idx
  on public.friend_requests(sender_id, recipient_id)
  where status = 'pending';

create table if not exists public.friendships (
  user_one_id uuid not null references public.profiles(id) on delete cascade,
  user_two_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_one_id, user_two_id),
  constraint friendships_distinct_users check (user_one_id <> user_two_id)
);

alter table public.friend_requests enable row level security;
alter table public.friendships enable row level security;

drop trigger if exists friend_requests_set_updated_at on public.friend_requests;
create trigger friend_requests_set_updated_at
before update on public.friend_requests
for each row
execute function public.set_updated_at();

drop policy if exists "users can view their own friend requests" on public.friend_requests;
create policy "users can view their own friend requests"
on public.friend_requests
for select
to authenticated
using (
  auth.uid() = (select user_id from public.profiles where id = sender_id)
  or auth.uid() = (select user_id from public.profiles where id = recipient_id)
);

drop policy if exists "authenticated users can send friend requests" on public.friend_requests;
create policy "authenticated users can send friend requests"
on public.friend_requests
for insert
to authenticated
with check (
  auth.uid() = (select user_id from public.profiles where id = sender_id)
);

drop policy if exists "participants can update friend requests" on public.friend_requests;
create policy "participants can update friend requests"
on public.friend_requests
for update
to authenticated
using (
  auth.uid() = (select user_id from public.profiles where id = sender_id)
  or auth.uid() = (select user_id from public.profiles where id = recipient_id)
)
with check (
  auth.uid() = (select user_id from public.profiles where id = sender_id)
  or auth.uid() = (select user_id from public.profiles where id = recipient_id)
);

drop policy if exists "participants can view their friendships" on public.friendships;
create policy "participants can view their friendships"
on public.friendships
for select
to authenticated
using (
  auth.uid() = (select user_id from public.profiles where id = user_one_id)
  or auth.uid() = (select user_id from public.profiles where id = user_two_id)
);

drop policy if exists "participants can create friendships" on public.friendships;
create policy "participants can create friendships"
on public.friendships
for insert
to authenticated
with check (
  auth.uid() = (select user_id from public.profiles where id = user_one_id)
  or auth.uid() = (select user_id from public.profiles where id = user_two_id)
);

drop policy if exists "participants can remove friendships" on public.friendships;
create policy "participants can remove friendships"
on public.friendships
for delete
to authenticated
using (
  auth.uid() = (select user_id from public.profiles where id = user_one_id)
  or auth.uid() = (select user_id from public.profiles where id = user_two_id)
);

commit;
