begin;

create or replace function public.build_direct_pair_key(profile_one_id uuid, profile_two_id uuid)
returns text
language sql
immutable
set search_path = public
as $$
  select least(profile_one_id::text, profile_two_id::text) || ':' || greatest(profile_one_id::text, profile_two_id::text);
$$;

alter table public.chat_rooms
add column if not exists direct_pair_key text;

with room_pair_keys as (
  select
    public.chat_rooms.id as room_id,
    case
      when count(public.chat_room_participants.profile_id) = 2 then
        public.build_direct_pair_key(
          (array_agg(public.chat_room_participants.profile_id order by public.chat_room_participants.profile_id))[1],
          (array_agg(public.chat_room_participants.profile_id order by public.chat_room_participants.profile_id))[2]
        )
      else null
    end as pair_key
  from public.chat_rooms
  left join public.chat_room_participants
    on public.chat_room_participants.room_id = public.chat_rooms.id
  where public.chat_rooms.is_group_chat = false
  group by public.chat_rooms.id
)
update public.chat_rooms
set direct_pair_key = room_pair_keys.pair_key
from room_pair_keys
where public.chat_rooms.id = room_pair_keys.room_id;

update public.chat_rooms
set direct_pair_key = null
where public.chat_rooms.is_group_chat = true;

with ranked_rooms as (
  select
    public.chat_rooms.id as room_id,
    public.chat_rooms.direct_pair_key,
    first_value(public.chat_rooms.id) over (
      partition by public.chat_rooms.direct_pair_key
      order by public.chat_rooms.updated_at desc, public.chat_rooms.created_at desc, public.chat_rooms.id desc
    ) as canonical_room_id,
    row_number() over (
      partition by public.chat_rooms.direct_pair_key
      order by public.chat_rooms.updated_at desc, public.chat_rooms.created_at desc, public.chat_rooms.id desc
    ) as room_rank
  from public.chat_rooms
  where public.chat_rooms.is_group_chat = false
    and public.chat_rooms.direct_pair_key is not null
),
duplicate_rooms as (
  select ranked_rooms.room_id as duplicate_room_id, ranked_rooms.canonical_room_id
  from ranked_rooms
  where ranked_rooms.room_rank > 1
)
update public.messages
set room_id = duplicate_rooms.canonical_room_id
from duplicate_rooms
where public.messages.room_id = duplicate_rooms.duplicate_room_id;

with ranked_rooms as (
  select
    public.chat_rooms.id as room_id,
    public.chat_rooms.direct_pair_key,
    first_value(public.chat_rooms.id) over (
      partition by public.chat_rooms.direct_pair_key
      order by public.chat_rooms.updated_at desc, public.chat_rooms.created_at desc, public.chat_rooms.id desc
    ) as canonical_room_id,
    row_number() over (
      partition by public.chat_rooms.direct_pair_key
      order by public.chat_rooms.updated_at desc, public.chat_rooms.created_at desc, public.chat_rooms.id desc
    ) as room_rank
  from public.chat_rooms
  where public.chat_rooms.is_group_chat = false
    and public.chat_rooms.direct_pair_key is not null
),
duplicate_rooms as (
  select ranked_rooms.room_id as duplicate_room_id, ranked_rooms.canonical_room_id
  from ranked_rooms
  where ranked_rooms.room_rank > 1
)
insert into public.chat_room_participants (
  room_id,
  profile_id,
  joined_at,
  last_read_at
)
select
  duplicate_rooms.canonical_room_id,
  public.chat_room_participants.profile_id,
  min(public.chat_room_participants.joined_at),
  max(public.chat_room_participants.last_read_at)
from duplicate_rooms
join public.chat_room_participants
  on public.chat_room_participants.room_id = duplicate_rooms.duplicate_room_id
group by duplicate_rooms.canonical_room_id, public.chat_room_participants.profile_id
on conflict (room_id, profile_id)
do update
set joined_at = least(public.chat_room_participants.joined_at, excluded.joined_at),
    last_read_at = case
      when public.chat_room_participants.last_read_at is null then excluded.last_read_at
      when excluded.last_read_at is null then public.chat_room_participants.last_read_at
      else greatest(public.chat_room_participants.last_read_at, excluded.last_read_at)
    end;

with ranked_rooms as (
  select
    public.chat_rooms.id as room_id,
    public.chat_rooms.direct_pair_key,
    first_value(public.chat_rooms.id) over (
      partition by public.chat_rooms.direct_pair_key
      order by public.chat_rooms.updated_at desc, public.chat_rooms.created_at desc, public.chat_rooms.id desc
    ) as canonical_room_id,
    row_number() over (
      partition by public.chat_rooms.direct_pair_key
      order by public.chat_rooms.updated_at desc, public.chat_rooms.created_at desc, public.chat_rooms.id desc
    ) as room_rank
  from public.chat_rooms
  where public.chat_rooms.is_group_chat = false
    and public.chat_rooms.direct_pair_key is not null
),
duplicate_rollup as (
  select
    ranked_rooms.canonical_room_id,
    min(public.chat_rooms.created_at) as earliest_created_at,
    max(public.chat_rooms.updated_at) as latest_updated_at
  from ranked_rooms
  join public.chat_rooms
    on public.chat_rooms.id = ranked_rooms.room_id
  where ranked_rooms.room_rank > 1
  group by ranked_rooms.canonical_room_id
)
update public.chat_rooms
set created_at = least(public.chat_rooms.created_at, duplicate_rollup.earliest_created_at),
    updated_at = greatest(public.chat_rooms.updated_at, duplicate_rollup.latest_updated_at)
from duplicate_rollup
where public.chat_rooms.id = duplicate_rollup.canonical_room_id;

with ranked_rooms as (
  select
    public.chat_rooms.id as room_id,
    public.chat_rooms.direct_pair_key,
    row_number() over (
      partition by public.chat_rooms.direct_pair_key
      order by public.chat_rooms.updated_at desc, public.chat_rooms.created_at desc, public.chat_rooms.id desc
    ) as room_rank
  from public.chat_rooms
  where public.chat_rooms.is_group_chat = false
    and public.chat_rooms.direct_pair_key is not null
)
delete from public.chat_rooms
using ranked_rooms
where public.chat_rooms.id = ranked_rooms.room_id
  and ranked_rooms.room_rank > 1;

drop index if exists public.chat_rooms_direct_pair_key_unique_idx;
create unique index chat_rooms_direct_pair_key_unique_idx
  on public.chat_rooms (direct_pair_key)
  where is_group_chat = false and direct_pair_key is not null;

create or replace function public.open_direct_conversation(viewer_profile_id uuid, target_profile_id uuid)
returns table (
  room_id uuid,
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
