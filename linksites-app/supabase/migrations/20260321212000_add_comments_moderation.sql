create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  status text not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint comments_status_check check (status in ('pending', 'approved', 'rejected')),
  constraint comments_content_length check (char_length(trim(content)) between 1 and 500)
);

create index if not exists comments_post_created_idx
  on public.comments(post_id, created_at desc);

alter table public.comments enable row level security;

drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at
before update on public.comments
for each row
execute function public.set_updated_at();

drop policy if exists "comments are readable when approved or owned" on public.comments;
create policy "comments are readable when approved or owned"
on public.comments
for select
using (
  (
    public.comments.status = 'approved'
    and exists (
      select 1
      from public.posts
      join public.profiles on public.profiles.id = public.posts.user_id
      where public.posts.id = public.comments.post_id
        and public.profiles.is_published = true
    )
  )
  or auth.uid() = (select user_id from public.profiles where id = public.comments.user_id)
  or auth.uid() = (
    select public.profiles.user_id
    from public.posts
    join public.profiles on public.profiles.id = public.posts.user_id
    where public.posts.id = public.comments.post_id
  )
);

drop policy if exists "authenticated users can create comments" on public.comments;
create policy "authenticated users can create comments"
on public.comments
for insert
to authenticated
with check (
  public.comments.status = 'pending'
  and auth.uid() = (select user_id from public.profiles where id = public.comments.user_id)
  and exists (
    select 1
    from public.posts
    join public.profiles on public.profiles.id = public.posts.user_id
    where public.posts.id = public.comments.post_id
      and public.profiles.is_published = true
  )
);

drop policy if exists "post owners can moderate comments" on public.comments;
create policy "post owners can moderate comments"
on public.comments
for update
to authenticated
using (
  auth.uid() = (
    select public.profiles.user_id
    from public.posts
    join public.profiles on public.profiles.id = public.posts.user_id
    where public.posts.id = public.comments.post_id
  )
)
with check (
  auth.uid() = (
    select public.profiles.user_id
    from public.posts
    join public.profiles on public.profiles.id = public.posts.user_id
    where public.posts.id = public.comments.post_id
  )
);

drop policy if exists "comment owners or post owners can delete comments" on public.comments;
create policy "comment owners or post owners can delete comments"
on public.comments
for delete
to authenticated
using (
  auth.uid() = (select user_id from public.profiles where id = public.comments.user_id)
  or auth.uid() = (
    select public.profiles.user_id
    from public.posts
    join public.profiles on public.profiles.id = public.posts.user_id
    where public.posts.id = public.comments.post_id
  )
);
