begin;

create table if not exists public.saved_posts (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (post_id, user_id)
);

create index if not exists saved_posts_user_created_idx
  on public.saved_posts(user_id, created_at desc);

create index if not exists saved_posts_post_idx
  on public.saved_posts(post_id);

alter table public.saved_posts enable row level security;

drop policy if exists "owners can view their own saved posts" on public.saved_posts;
create policy "owners can view their own saved posts"
on public.saved_posts
for select
to authenticated
using (auth.uid() = (select user_id from public.profiles where id = public.saved_posts.user_id));

drop policy if exists "authenticated users can save posts" on public.saved_posts;
create policy "authenticated users can save posts"
on public.saved_posts
for insert
to authenticated
with check (
  auth.uid() = (select user_id from public.profiles where id = public.saved_posts.user_id)
  and exists (
    select 1
    from public.posts
    join public.profiles on public.profiles.id = public.posts.user_id
    where public.posts.id = public.saved_posts.post_id
      and public.profiles.is_published = true
  )
);

drop policy if exists "owners can unsave their own posts" on public.saved_posts;
create policy "owners can unsave their own posts"
on public.saved_posts
for delete
to authenticated
using (auth.uid() = (select user_id from public.profiles where id = public.saved_posts.user_id));

commit;
