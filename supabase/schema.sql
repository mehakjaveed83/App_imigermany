create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  country text not null check (country in ('india', 'pakistan', 'bangladesh')),
  purpose text not null check (purpose in ('study', 'work', 'family-reunion')),
  city text not null check (city in ('berlin', 'munich', 'hamburg', 'frankfurt', 'other')),
  stage text not null check (stage in ('before-visa', 'visa-approved', 'arrived')),
  arrival_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checklist_tasks (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  priority text not null check (priority in ('high', 'medium', 'low')),
  applies_to_countries text[] not null,
  applies_to_purposes text[] not null,
  applies_to_stages text[] not null,
  applies_to_cities text[] not null,
  due_offset_days integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  checklist_task_id text not null,
  title text not null,
  category text not null,
  description text not null,
  priority text not null check (priority in ('high', 'medium', 'low')),
  due_offset_days integer not null,
  completed boolean not null default false,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checklist_task_id)
);

alter table public.profiles enable row level security;
alter table public.checklist_tasks enable row level security;
alter table public.user_tasks enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Authenticated users can read active checklist tasks" on public.checklist_tasks;
create policy "Authenticated users can read active checklist tasks"
  on public.checklist_tasks for select
  to authenticated
  using (is_active = true);

drop policy if exists "Users can read their own tasks" on public.user_tasks;
create policy "Users can read their own tasks"
  on public.user_tasks for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own tasks" on public.user_tasks;
create policy "Users can create their own tasks"
  on public.user_tasks for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own tasks" on public.user_tasks;
create policy "Users can update their own tasks"
  on public.user_tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own tasks" on public.user_tasks;
create policy "Users can delete their own tasks"
  on public.user_tasks for delete
  using (auth.uid() = user_id);
