-- ==============================================================================
-- IRONPULSE - DATABASE SCHEMA (PostgreSQL / Supabase)
-- Suivi Musculation, Nutrition & Préparation Hyrox 2027
-- ==============================================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- 1. TABLE: profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  athlete_code text unique,
  avatar_url text,
  gender text check (gender in ('male', 'female', 'other')) default 'male',
  birth_date date,
  age integer default 25,
  height_cm numeric(5,2) default 178.0,
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'very_active', 'extra_active')) default 'moderate',
  goal text check (goal in ('cut', 'maintenance', 'bulk', 'recomp')) default 'recomp',
  formula text check (formula in ('mifflin', 'harris_benedict')) default 'mifflin',
  target_calories integer default 2400,
  target_protein_g integer default 160,
  target_carbs_g integer default 260,
  target_fat_g integer default 70,
  hyrox_division text check (hyrox_division in ('open_men', 'open_women', 'pro_men', 'pro_women', 'doubles_men', 'doubles_women', 'doubles_mixed')) default 'open_men',
  hyrox_target_date date default '2027-04-17',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TABLE: exercises
create table if not exists public.exercises (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade, -- NULL if global default exercise
  name text not null,
  muscle_group text not null check (muscle_group in ('chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'abs', 'full_body', 'cardio')),
  equipment text check (equipment in ('barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'other')),
  description text,
  is_custom boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TABLE: workouts
create table if not exists public.workouts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  split_type text check (split_type in ('push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'hyrox_strength', 'custom')) default 'custom',
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  duration_seconds integer default 0,
  notes text,
  rating integer check (rating >= 1 and rating <= 5),
  total_volume_kg numeric(10,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TABLE: workout_sets
create table if not exists public.workout_sets (
  id uuid primary key default uuid_generate_v4(),
  workout_id uuid references public.workouts(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) on delete restrict not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  set_order integer not null default 1,
  weight_kg numeric(6,2) not null default 0,
  reps integer not null default 0,
  rpe numeric(3,1) check (rpe >= 1 and rpe <= 10),
  rest_seconds integer default 90,
  is_warmup boolean default false,
  is_completed boolean default true,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. TABLE: weight_logs
create table if not exists public.weight_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  logged_date date not null default current_date,
  weight_kg numeric(5,2) not null,
  body_fat_pct numeric(4,2),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_weight_date unique (user_id, logged_date)
);

-- 6. TABLE: hyrox_logs
create table if not exists public.hyrox_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  logged_date date not null default current_date,
  station_type text not null check (
    station_type in (
      'RUN_1KM',
      'SKIERG_1000M',
      'SLED_PUSH',
      'SLED_PULL',
      'BURPEE_BROAD_JUMP_80M',
      'ROW_1000M',
      'FARMERS_CARRY_200M',
      'SANDBAG_LUNGES_100M',
      'WALL_BALLS',
      'FULL_SIMULATION',
      'HALF_SIMULATION'
    )
  ),
  time_seconds integer not null,
  distance_meters integer,
  weight_kg numeric(6,2),
  reps integer,
  average_pace text,
  heart_rate_avg integer,
  rpe numeric(3,1),
  notes text,
  is_personal_record boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_workout_sets_workout_id on public.workout_sets(workout_id);
create index if not exists idx_workout_sets_exercise_id on public.workout_sets(exercise_id);
create index if not exists idx_workouts_user_id on public.workouts(user_id);
create index if not exists idx_weight_logs_user_date on public.weight_logs(user_id, logged_date);
create index if not exists idx_hyrox_logs_user_station on public.hyrox_logs(user_id, station_type);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;
alter table public.weight_logs enable row level security;
alter table public.hyrox_logs enable row level security;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Exercises Policies
create policy "Users can view default or own exercises" on public.exercises
  for select using (user_id is null or auth.uid() = user_id);
create policy "Users can insert custom exercises" on public.exercises
  for insert with check (auth.uid() = user_id);
create policy "Users can update own custom exercises" on public.exercises
  for update using (auth.uid() = user_id);
create policy "Users can delete own custom exercises" on public.exercises
  for delete using (auth.uid() = user_id);

-- Workouts Policies
create policy "Users can manage own workouts" on public.workouts
  for all using (auth.uid() = user_id);

-- Workout Sets Policies
create policy "Users can manage own workout sets" on public.workout_sets
  for all using (auth.uid() = user_id);

-- Weight Logs Policies
create policy "Users can manage own weight logs" on public.weight_logs
  for all using (auth.uid() = user_id);

-- Hyrox Logs Policies
create policy "Users can manage own hyrox logs" on public.hyrox_logs
  for all using (auth.uid() = user_id);

-- Trigger to create profile upon Supabase auth.users creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Athlète'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed Default Exercise Library
insert into public.exercises (name, muscle_group, equipment, is_custom) values
  ('Développé Couché (Barre)', 'chest', 'barbell', false),
  ('Développé Incliné (Haltères)', 'chest', 'dumbbell', false),
  ('Écarté Poulie Vis-à-vis', 'chest', 'cable', false),
  ('Dips Pectoraux', 'chest', 'bodyweight', false),
  ('Pompes lestées', 'chest', 'bodyweight', false),
  ('Tractions Pronation', 'back', 'bodyweight', false),
  ('Tirage Vertical Poulie', 'back', 'cable', false),
  ('Rowing Barre Buste Penché', 'back', 'barbell', false),
  ('Rowing Haltère unilatéral', 'back', 'dumbbell', false),
  ('Tirage Horizontal Poulie (Basse)', 'back', 'cable', false),
  ('Soulevé de Terre (Deadlift)', 'back', 'barbell', false),
  ('Squat Arrière (Back Squat)', 'legs', 'barbell', false),
  ('Front Squat', 'legs', 'barbell', false),
  ('Presse à Cuisses', 'legs', 'machine', false),
  ('Fentes Marchées (Haltères)', 'legs', 'dumbbell', false),
  ('Leg Extension', 'legs', 'machine', false),
  ('Leg Curl Ischios', 'legs', 'machine', false),
  ('Mollets Debout Machine', 'legs', 'machine', false),
  ('Développé Militaire (Overhead Press)', 'shoulders', 'barbell', false),
  ('Élévations Latérales Haltères', 'shoulders', 'dumbbell', false),
  ('Élévations Latérales Poulie', 'shoulders', 'cable', false),
  ('Face Pull Poulie Haute', 'shoulders', 'cable', false),
  ('Oiseau Banc Incliné (Arrière d''épaules)', 'shoulders', 'dumbbell', false),
  ('Curl Biceps Barre EZ', 'biceps', 'barbell', false),
  ('Curl Incliné Haltères', 'biceps', 'dumbbell', false),
  ('Curl Marteau Haltères', 'biceps', 'dumbbell', false),
  ('Curl Spider Poulie', 'biceps', 'cable', false),
  ('Barre au Front (Skullcrushers)', 'triceps', 'barbell', false),
  ('Extension Triceps Poulie Haute', 'triceps', 'cable', false),
  ('Dips Prise Serrée', 'triceps', 'bodyweight', false),
  ('Extension Triceps Au-dessus de la Tête', 'triceps', 'cable', false),
  ('Relevé de Jambes Suspendu', 'abs', 'bodyweight', false),
  ('Crunch Poulie Haute', 'abs', 'cable', false),
  ('Planche Gainage Lestée', 'abs', 'bodyweight', false),
  ('Roue Abdominale (Ab Wheel)', 'abs', 'other', false),
  ('Burpees', 'full_body', 'bodyweight', false),
  ('Kettlebell Swing', 'full_body', 'kettlebell', false),
  ('Thrusters', 'full_body', 'barbell', false),
  ('Clean & Jerk', 'full_body', 'barbell', false),
  ('Snatch', 'full_body', 'barbell', false)
on conflict do nothing;
