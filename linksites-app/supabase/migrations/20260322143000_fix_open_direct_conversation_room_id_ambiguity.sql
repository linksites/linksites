begin;

drop function if exists public.open_direct_conversation(uuid, uuid);

create or replace function public.open_direct_conversation(viewer_profile_id uuid, target_profile_id uuid)
returns table (
  opened_room_id uuid,
  reason text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  authenticated_profile_id uuid;
  normalized_user_one_id uuid;
  normalized_user_two_id uuid;
  direct_room_id uuid;
  pair_key text;
begin
  select public.profiles.id
  into authenticated_profile_id
  from public.profiles
  where public.profiles.user_id = auth.uid();

  if authenticated_profile_id is null then
    return query select null::uuid, 'room_create_failed'::text;
    return;
  end if;

  if authenticated_profile_id <> viewer_profile_id or viewer_profile_id = target_profile_id then
    return query select null::uuid, 'room_create_failed'::text;
    return;
  end if;

  if viewer_profile_id::text <= target_profile_id::text then
    normalized_user_one_id := viewer_profile_id;
    normalized_user_two_id := target_profile_id;
  else
    normalized_user_one_id := target_profile_id;
    normalized_user_two_id := viewer_profile_id;
  end if;

  if not exists (
    select 1
    from public.friendships
    where public.friendships.user_one_id = normalized_user_one_id
      and public.friendships.user_two_id = normalized_user_two_id
  ) then
    return query select null::uuid, 'not_friends'::text;
    return;
  end if;

  pair_key := public.build_direct_pair_key(viewer_profile_id, target_profile_id);

  insert into public.chat_rooms (
    creator_profile_id,
    direct_pair_key,
    is_group_chat
  )
  values (
    viewer_profile_id,
    pair_key,
    false
  )
  on conflict do nothing
  returning public.chat_rooms.id into direct_room_id;

  if direct_room_id is null then
    select public.chat_rooms.id
    into direct_room_id
    from public.chat_rooms
    where public.chat_rooms.is_group_chat = false
      and public.chat_rooms.direct_pair_key = pair_key
    order by public.chat_rooms.updated_at desc, public.chat_rooms.created_at desc
    limit 1;
  end if;

  if direct_room_id is null then
    return query select null::uuid, 'room_create_failed'::text;
    return;
  end if;

  insert into public.chat_room_participants (
    room_id,
    profile_id,
    last_read_at
  )
  values (
    direct_room_id,
    viewer_profile_id,
    timezone('utc', now())
  )
  on conflict (room_id, profile_id)
  do update
  set last_read_at = coalesce(public.chat_room_participants.last_read_at, excluded.last_read_at);

  insert into public.chat_room_participants (
    room_id,
    profile_id
  )
  values (
    direct_room_id,
    target_profile_id
  )
  on conflict (room_id, profile_id) do nothing;

  return query select direct_room_id, null::text;
end;
$$;

commit;
