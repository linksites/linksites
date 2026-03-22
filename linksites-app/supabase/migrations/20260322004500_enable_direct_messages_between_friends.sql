begin;

alter table public.chat_room_participants
add column if not exists last_read_at timestamptz;

alter table public.chat_rooms enable row level security;
alter table public.chat_room_participants enable row level security;

drop trigger if exists chat_rooms_set_updated_at on public.chat_rooms;
create trigger chat_rooms_set_updated_at
before update on public.chat_rooms
for each row
execute function public.set_updated_at();

drop policy if exists "participants can update their chat rooms" on public.chat_rooms;
create policy "participants can update their chat rooms"
on public.chat_rooms
for update
to authenticated
using (
  exists (
    select 1
    from public.chat_room_participants
    where public.chat_room_participants.room_id = public.chat_rooms.id
      and public.chat_room_participants.profile_id = (select id from public.profiles where user_id = auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.chat_room_participants
    where public.chat_room_participants.room_id = public.chat_rooms.id
      and public.chat_room_participants.profile_id = (select id from public.profiles where user_id = auth.uid())
  )
);

drop policy if exists "authenticated users can add themselves to chat rooms" on public.chat_room_participants;
create policy "authenticated users can add themselves to chat rooms"
on public.chat_room_participants
for insert
to authenticated
with check (
  profile_id = (select id from public.profiles where user_id = auth.uid())
  or exists (
    select 1
    from public.chat_room_participants as current_participant
    where current_participant.room_id = public.chat_room_participants.room_id
      and current_participant.profile_id = (select id from public.profiles where user_id = auth.uid())
  )
);

drop policy if exists "participants can update their own chat room row" on public.chat_room_participants;
create policy "participants can update their own chat room row"
on public.chat_room_participants
for update
to authenticated
using (
  profile_id = (select id from public.profiles where user_id = auth.uid())
)
with check (
  profile_id = (select id from public.profiles where user_id = auth.uid())
);

commit;
