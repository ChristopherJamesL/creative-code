-- ============================================================
-- Legal App — Supabase Schema
-- Paste this into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Documents table
create table if not exists documents (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  title       text        not null,
  client      text        not null,
  type        text        not null check (type in ('pdf', 'docx')),
  status      text        not null default 'pending' check (status in ('approved', 'pending', 'rejected')),
  date        date        not null default current_date,
  ai_ready    boolean     not null default false,
  file_url    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at on row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger documents_updated_at
  before update on documents
  for each row execute procedure update_updated_at();

-- Row-Level Security: users can only access their own documents
alter table documents enable row level security;

create policy "select own documents"
  on documents for select
  using (auth.uid() = user_id);

create policy "insert own documents"
  on documents for insert
  with check (auth.uid() = user_id);

create policy "update own documents"
  on documents for update
  using (auth.uid() = user_id);

create policy "delete own documents"
  on documents for delete
  using (auth.uid() = user_id);

-- Index for common queries
create index if not exists documents_user_id_idx on documents (user_id);
create index if not exists documents_status_idx  on documents (user_id, status);
