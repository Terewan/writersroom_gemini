-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Projects Table
create table public.gemini_projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  logline text,
  format text check (format in ('tv', 'film', 'custom')) default 'tv',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Agents Table
create table public.gemini_agents (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.gemini_projects(id) on delete cascade not null,
  name text not null,
  role text not null,
  system_prompt text not null,
  color_hex text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Show Bible Table
create table public.gemini_show_bibles (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.gemini_projects(id) on delete cascade not null,
  document_type text check (document_type in ('premise', 'rules', 'character', 'theme', 'custom')) not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Beats Table (For the Beat Board)
create table public.gemini_beats (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.gemini_projects(id) on delete cascade not null,
  character_id uuid references public.gemini_agents(id) on delete set null, -- Optional: Tie beat to a specific character/agent
  type text check (type in ('plot', 'emotion')) default 'plot',
  content text not null,
  emotion_tag text, -- From the Junto Emotion Wheel
  act_section text not null, -- e.g., 'Act 1', 'Midpoint', 'Act 2', 'Act 3'
  position_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Chats Table
create table public.gemini_chats (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.gemini_projects(id) on delete cascade not null,
  title text,
  smart_summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Messages Table
create table public.gemini_messages (
  id uuid default uuid_generate_v4() primary key,
  chat_id uuid references public.gemini_chats(id) on delete cascade not null,
  role text check (role in ('user', 'assistant', 'system')) not null,
  content text not null,
  agent_id uuid references public.gemini_agents(id) on delete set null, -- Null if user, populated if specific AI agent
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Inbox (Proposed Updates)
create table public.gemini_proposals (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.gemini_projects(id) on delete cascade not null,
  chat_id uuid references public.gemini_chats(id) on delete set null,
  proposed_by uuid references public.gemini_agents(id) on delete set null,
  target_table text not null check (target_table in ('gemini_show_bibles', 'gemini_beats', 'gemini_projects')),
  proposed_content jsonb not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Setup Row Level Security (RLS)
alter table public.gemini_projects enable row level security;
alter table public.gemini_agents enable row level security;
alter table public.gemini_show_bibles enable row level security;
alter table public.gemini_beats enable row level security;
alter table public.gemini_chats enable row level security;
alter table public.gemini_messages enable row level security;
alter table public.gemini_proposals enable row level security;

-- Create basic RLS policies (Users can only see/edit their own project data)
create policy "Users can manage their own projects" 
  on public.gemini_projects for all using (auth.uid() = user_id);

create policy "Users can manage data linked to their projects" 
  on public.gemini_agents for all using (
    project_id in (select id from public.gemini_projects where user_id = auth.uid())
  );

create policy "Users can manage show bibles linked to their projects" 
  on public.gemini_show_bibles for all using (
    project_id in (select id from public.gemini_projects where user_id = auth.uid())
  );

create policy "Users can manage beats linked to their projects" 
  on public.gemini_beats for all using (
    project_id in (select id from public.gemini_projects where user_id = auth.uid())
  );

create policy "Users can manage chats linked to their projects" 
  on public.gemini_chats for all using (
    project_id in (select id from public.gemini_projects where user_id = auth.uid())
  );

create policy "Users can manage messages linked to their projects" 
  on public.gemini_messages for all using (
    chat_id in (select id from public.gemini_chats where project_id in (select id from public.gemini_projects where user_id = auth.uid()))
  );

create policy "Users can manage proposals linked to their projects" 
  on public.gemini_proposals for all using (
    project_id in (select id from public.gemini_projects where user_id = auth.uid())
  );
