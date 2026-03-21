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
);

drop policy if exists "owners can create their own posts" on public.posts;
create policy "owners can create their own posts"
on public.posts
for insert
to authenticated
with check (auth.uid() = (select user_id from public.profiles where public.profiles.id = public.posts.user_id));

drop policy if exists "owners can update their own posts" on public.posts;
create policy "owners can update their own posts"
on public.posts
for update
to authenticated
using (auth.uid() = (select user_id from public.profiles where public.profiles.id = public.posts.user_id));

drop policy if exists "owners can delete their own posts" on public.posts;
create policy "owners can delete their own posts"
on public.posts
for delete
to authenticated
using (auth.uid() = (select user_id from public.profiles where public.profiles.id = public.posts.user_id));

drop policy if exists "owners can update their own presence" on public.user_presence;
create policy "owners can update their own presence"
on public.user_presence
for update
to authenticated
using (auth.uid() = (select user_id from public.profiles where public.profiles.id = public.user_presence.user_id));

drop policy if exists "owners can insert their own presence" on public.user_presence;
create policy "owners can insert their own presence"
on public.user_presence
for insert
to authenticated
with check (auth.uid() = (select user_id from public.profiles where public.profiles.id = public.user_presence.user_id));

drop policy if exists "reactions are readable by everyone" on public.reactions;
create policy "reactions are readable by everyone"
on public.reactions
for select
using (
  exists (
    select 1
    from public.posts
    join public.profiles on public.profiles.id = public.posts.user_id
    where public.posts.id = public.reactions.post_id
      and public.profiles.is_published = true
  )
  or auth.uid() = (select user_id from public.profiles where id = public.reactions.user_id)
);
