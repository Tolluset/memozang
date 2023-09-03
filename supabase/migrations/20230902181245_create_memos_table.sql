create table
  memos (
    id bigint primary key generated always as identity,
    title text,
    content text not null,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone,
    user_id uuid references auth.users not null
  );

alter table memos enable row level security;

create policy "Allow individual read access" on memos
  for select using (auth.uid() = user_id);
create policy "Allow individual insert access" on memos
  for insert with check (auth.uid() = user_id);
create policy "Allow individual update access" on memos
  for update using (auth.uid() = user_id);
create policy "Allow individual delete access" on memos
  for delete using (auth.uid() = user_id);
