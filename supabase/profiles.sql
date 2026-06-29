-- ============================================================
-- Legal App — Profiles & Roles
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- Run this AFTER schema.sql
-- ============================================================

-- Profiles table — extends auth.users with role + metadata
create table if not exists profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  email       text        not null,
  full_name   text        not null default '',
  role        text        not null default 'staff'
                          check (role in ('admin', 'attorney', 'staff')),
  invited_by  uuid        references profiles(id),
  created_at  timestamptz not null default now()
);

alter table profiles enable row level security;

-- Any authenticated user can view all profiles (needed for admin user list)
create policy "authenticated users can view profiles"
  on profiles for select
  using (auth.uid() is not null);

-- Only the service role (server) can insert/update/delete profiles
create policy "service role manages profiles"
  on profiles for all
  using (auth.role() = 'service_role');


-- Profile creation is handled explicitly by the server in httpSetPassword.
-- No trigger — profiles are only created when a user completes account setup.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();


-- ============================================================
-- Backfill: if you already have a user in auth.users from
-- earlier setup, run this to create their profile as admin.
-- Safe to run even if profiles already exist (uses ON CONFLICT).
-- ============================================================
insert into public.profiles (id, email, full_name, role)
select
  id,
  coalesce(email, ''),
  coalesce(raw_user_meta_data->>'full_name', ''),
  'admin'
from auth.users
on conflict (id) do nothing;
