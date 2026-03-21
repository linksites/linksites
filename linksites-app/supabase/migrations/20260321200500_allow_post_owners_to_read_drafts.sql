drop policy if exists "posts are readable by everyone" on public.posts;
create policy "posts are readable by everyone"
on public.posts
for select
using (
  exists (
    select 1
    from public.profiles
    where public.profiles.id = public.posts.user_id
      and public.profiles.is_published = true
  )
  or auth.uid() = (select user_id from public.profiles where public.profiles.id = public.posts.user_id)
);
