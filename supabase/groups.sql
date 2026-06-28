-- ============================================================
-- Legal App — Document Groups
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

create table if not exists document_groups (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null unique,
  created_at timestamptz not null default now()
);

alter table document_groups enable row level security;

create policy "authenticated users can read groups"
  on document_groups for select
  to authenticated
  using (true);

create policy "authenticated users can create groups"
  on document_groups for insert
  to authenticated
  with check (true);

-- Add group_id column to documents
alter table documents
  add column if not exists group_id uuid references document_groups(id) on delete set null;

create index if not exists documents_group_id_idx on documents (group_id);
