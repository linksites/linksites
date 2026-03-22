begin;

drop policy if exists "authenticated users can view their chat room participants" on public.chat_room_participants;
create policy "authenticated users can view their chat room participants"
on public.chat_room_participants
for select
to authenticated
using (
  profile_id = (select id from public.profiles where user_id = auth.uid())
  or exists (
    select 1
    from public.chat_rooms
    where public.chat_rooms.id = public.chat_room_participants.room_id
      and public.chat_rooms.creator_profile_id = (select id from public.profiles where user_id = auth.uid())
  )
);

drop policy if exists "authenticated users can add themselves to chat rooms" on public.chat_room_participants;
create policy "authenticated users can add themselves to chat rooms"
on public.chat_room_participants
for insert
to authenticated
with check (
  exists (
    select 1
    from public.chat_rooms
    where public.chat_rooms.id = public.chat_room_participants.room_id
      and public.chat_rooms.creator_profile_id = (select id from public.profiles where user_id = auth.uid())
  )
);

commit;
