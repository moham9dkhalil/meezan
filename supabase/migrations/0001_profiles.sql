-- ===========================================================================
-- Meezan — Supabase schema (profiles + auth trigger + RLS)
-- Run this in the Supabase SQL Editor (or via `supabase db push`).
-- ===========================================================================

create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  name          text not null default 'محاسب ميزان',
  avatar        text not null default '👨‍💼',
  role          text not null default 'طالب محاسبة',
  learning_track text not null default 'corporate',
  xp            integer not null default 150,
  streak        integer not null default 0,
  joined_date   text,
  progress      jsonb not null default '{}'::jsonb,
  is_admin      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);

alter table public.profiles enable row level security;

-- Owners can read / insert / update only their own profile row.
drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar, role, learning_track, joined_date)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1), 'محاسب ميزان'),
    coalesce(new.raw_user_meta_data ->> 'avatar', '👨‍💼'),
    coalesce(new.raw_user_meta_data ->> 'role', 'طالب محاسبة'),
    coalesce(new.raw_user_meta_data ->> 'learning_track', 'corporate'),
    to_char(now(), 'YYYY-MM-DD')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at fresh on every update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
