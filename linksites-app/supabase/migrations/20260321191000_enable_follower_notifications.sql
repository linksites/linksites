drop policy if exists "authenticated users can create follower notifications" on public.notifications;
create policy "authenticated users can create follower notifications"
on public.notifications
for insert
to authenticated
with check (
  public.notifications.type = 'new_follower'
  and public.notifications.sender_id is not null
  and public.notifications.sender_id <> public.notifications.recipient_id
  and auth.uid() = (select user_id from public.profiles where id = public.notifications.sender_id)
);
