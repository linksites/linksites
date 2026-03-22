begin;

alter table public.chat_rooms
add column if not exists creator_profile_id uuid references public.profiles(id) on delete set null;

drop policy if exists "authenticated users can view their chat rooms" on public.chat_rooms;
create policy "authenticated users can view their chat rooms"
on public.chat_rooms
for select
to authenticated
using (
  creator_profile_id = (select id from public.profiles where user_id = auth.uid())
  or exists (
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
with check (
  creator_profile_id = (select id from public.profiles where user_id = auth.uid())
);

commit;
