alter table public.profiles
add column if not exists followers_count integer not null default 0;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'followers_count_nonnegative'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
    add constraint followers_count_nonnegative check (followers_count >= 0);
  end if;
end
$$;

create or replace function public.sync_profile_followers_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.follower_id = new.followed_id then
      raise exception 'profiles cannot follow themselves';
    end if;

    update public.profiles
    set followers_count = followers_count + 1
    where id = new.followed_id;

    return new;
  end if;

  if tg_op = 'DELETE' then
    update public.profiles
    set followers_count = greatest(followers_count - 1, 0)
    where id = old.followed_id;

    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists follows_sync_followers_count on public.follows;

create trigger follows_sync_followers_count
after insert or delete on public.follows
for each row
execute function public.sync_profile_followers_count();

update public.profiles as profile
set followers_count = counts.followers_count
from (
  select
    profiles.id,
    coalesce(count(follows.followed_id), 0)::integer as followers_count
  from public.profiles
  left join public.follows on follows.followed_id = profiles.id
  group by profiles.id
) as counts
where profile.id = counts.id;
