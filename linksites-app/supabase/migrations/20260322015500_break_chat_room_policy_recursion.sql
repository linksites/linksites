begin;

create or replace function public.is_current_user_room_participant(room_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.chat_room_participants
    join public.profiles on public.profiles.id = public.chat_room_participants.profile_id
    where public.chat_room_participants.room_id = room_uuid
      and public.profiles.user_id = auth.uid()
  );
$$;

create or replace function public.is_current_user_chat_room_creator(room_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.chat_rooms
    join public.profiles on public.profiles.id = public.chat_rooms.creator_profile_id
    where public.chat_rooms.id = room_uuid
      and public.profiles.user_id = auth.uid()
  );
$$;

drop policy if exists "authenticated users can view their chat rooms" on public.chat_rooms;
create policy "authenticated users can view their chat rooms"
on public.chat_rooms
for select
to authenticated
using (
  creator_profile_id = (select id from public.profiles where user_id = auth.uid())
  or public.is_current_user_room_participant(id)
);

drop policy if exists "participants can update their chat rooms" on public.chat_rooms;
create policy "participants can update their chat rooms"
on public.chat_rooms
for update
to authenticated
using (
  creator_profile_id = (select id from public.profiles where user_id = auth.uid())
  or public.is_current_user_room_participant(id)
)
with check (
  creator_profile_id = (select id from public.profiles where user_id = auth.uid())
  or public.is_current_user_room_participant(id)
);

drop policy if exists "authenticated users can view their chat room participants" on public.chat_room_participants;
create policy "authenticated users can view their chat room participants"
on public.chat_room_participants
for select
to authenticated
using (
  profile_id = (select id from public.profiles where user_id = auth.uid())
  or public.is_current_user_room_participant(room_id)
);

drop policy if exists "authenticated users can add themselves to chat rooms" on public.chat_room_participants;
create policy "authenticated users can add themselves to chat rooms"
on public.chat_room_participants
for insert
to authenticated
with check (
  public.is_current_user_chat_room_creator(room_id)
);

commit;
