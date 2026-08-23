-- Portfolio schema for Supabase (pg_graphql)
-- Run this in the Supabase SQL Editor

-- ── Tables ────────────────────────────────────────────────────────────────────

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  years_experience text not null,
  location text not null,
  tagline text not null,
  about text[] not null default '{}',
  email text not null,
  resume text not null default '#',
  created_at timestamptz not null default now()
);

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  label text not null,
  href text not null,
  sort_order int not null default 0
);

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  company text not null,
  role text not null,
  period text not null,
  location text not null,
  bullets text[] not null default '{}',
  sort_order int not null default 0
);

create table if not exists skill_groups (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  category text not null,
  skills text[] not null default '{}',
  sort_order int not null default 0
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  slug text not null unique,
  name text not null,
  description text not null,
  details text[] not null default '{}',
  highlights text[] not null default '{}',
  stack text[] not null default '{}',
  repo text not null,
  demo text not null default '#',
  sort_order int not null default 0
);

-- ── Row Level Security (public read) ─────────────────────────────────────────

alter table profiles enable row level security;
alter table social_links enable row level security;
alter table experiences enable row level security;
alter table skill_groups enable row level security;
alter table projects enable row level security;

create policy "Public read profiles" on profiles for select using (true);
create policy "Public read social_links" on social_links for select using (true);
create policy "Public read experiences" on experiences for select using (true);
create policy "Public read skill_groups" on skill_groups for select using (true);
create policy "Public read projects" on projects for select using (true);

-- ── Seed data ─────────────────────────────────────────────────────────────────

insert into profiles (name, title, years_experience, location, tagline, about, email, resume)
values (
  'Alex Rivera',
  'Software Engineer',
  '3 yrs',
  'Remote / Jakarta',
  'I build reliable web apps — APIs, frontends, and the glue between them.',
  array[
    'Software engineer with 3 years shipping production features across the stack. I care about readable code, fast feedback loops, and systems that don''t fall over at 2am.',
    'Most of my work sits in TypeScript ecosystems — Vue/React on the front, Node on the back, Postgres underneath. Comfortable owning a feature from ticket to deploy.',
    'Outside work: side projects, reading RFCs nobody asked for, and occasionally fixing CI pipelines that should have worked the first time.'
  ],
  'alex.rivera@example.com',
  '#'
)
on conflict do nothing;

-- Use the first profile for seeding related rows
do $$
declare
  pid uuid;
begin
  select id into pid from profiles limit 1;

  if pid is null then
    return;
  end if;

  -- Only seed if no projects exist yet
  if exists (select 1 from projects where profile_id = pid) then
    return;
  end if;

  insert into social_links (profile_id, label, href, sort_order) values
    (pid, 'GitHub', 'https://github.com', 0),
    (pid, 'LinkedIn', 'https://linkedin.com', 1),
    (pid, 'Email', 'mailto:alex.rivera@example.com', 2);

  insert into experiences (profile_id, company, role, period, location, bullets, sort_order) values
    (pid, 'Nexus Labs', 'Software Engineer', '2023 — Present', 'Remote', array[
      'Shipped customer-facing dashboard in Vue 3 + TypeScript, cutting page load time by 40%.',
      'Designed REST APIs in Node.js consumed by web and mobile clients; added OpenAPI docs for onboarding.',
      'Introduced Vitest + Playwright to CI pipeline — caught regressions before they hit staging.',
      'Owned feature flags rollout for a billing module used by 2k+ accounts.'
    ], 0),
    (pid, 'ByteForge', 'Junior Software Engineer', '2022 — 2023', 'Jakarta', array[
      'Built internal tooling in React + Express to automate data imports, saving ~6 hrs/week for ops.',
      'Maintained Postgres schemas and wrote migration scripts for zero-downtime deploys.',
      'Paired with senior engineers on code reviews; picked up testing habits and deployment workflows.',
      'Fixed performance bottlenecks in N+1 queries — response times dropped from 800ms to 120ms.'
    ], 1);

  insert into skill_groups (profile_id, category, skills, sort_order) values
    (pid, 'Languages', array['TypeScript', 'JavaScript', 'Python', 'SQL'], 0),
    (pid, 'Frontend', array['Vue 3', 'React', 'HTML/CSS', 'Vite', 'Tailwind'], 1),
    (pid, 'Backend', array['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'Redis'], 2),
    (pid, 'Infra & Tools', array['Docker', 'Git', 'GitHub Actions', 'Linux', 'Vitest', 'Playwright'], 3);

  insert into projects (profile_id, slug, name, description, details, highlights, stack, repo, demo, sort_order) values
    (pid, 'devlog-sh', 'devlog.sh',
      'This portfolio — a terminal-themed single-page site built with Vue 3 and Vite. No framework bloat, just hash nav and a content file you can swap in 5 minutes.',
      array[
        'A personal portfolio designed to look like a terminal session. Built with Vue 3, TypeScript, and Vite — no CSS framework, no unnecessary dependencies.',
        'All content lives in Supabase and is fetched via GraphQL. Hash-based section navigation keeps it fast and simple.'
      ],
      array[
        'Terminal aesthetic with IBM Plex Mono, phosphor green accents, and scanline overlay',
        'Responsive layout with mobile hamburger menu styled as command list',
        'Typewriter animation on hero prompt, IntersectionObserver for active nav',
        'Project detail pages via Vue Router with slug-based routing'
      ],
      array['Vue 3', 'TypeScript', 'Vite', 'CSS', 'Supabase'],
      'https://github.com', '#', 0),
    (pid, 'taskflow-api', 'Taskflow API',
      'Full-stack task manager with JWT auth, role-based access, and real-time updates via WebSockets. Postgres for persistence, Redis for session cache.',
      array[
        'Taskflow is a team task management app built for small engineering teams. Users can create projects, assign tasks, set priorities, and get real-time updates when teammates make changes.',
        'The backend exposes a REST API with JWT authentication and role-based access control. WebSocket connections push task updates to connected clients without polling.'
      ],
      array[
        'JWT auth with refresh token rotation and role-based permissions',
        'Real-time task updates via WebSocket — no page refresh needed',
        'Postgres with proper indexes; Redis session cache for sub-50ms auth checks',
        'Vue 3 frontend with optimistic UI updates and offline-friendly error handling'
      ],
      array['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Vue 3'],
      'https://github.com', 'https://example.com', 1),
    (pid, 'deploy-kit', 'deploy-kit',
      'CLI tool that wraps Docker + GitHub Actions into one-command deploys for small teams. Parses a yaml config and generates workflow files.',
      array[
        'deploy-kit is a CLI that reads a simple YAML config and generates Docker + GitHub Actions workflow files. Small teams without a dedicated DevOps person can go from zero to CI/CD in one command.',
        'The tool validates config, scaffolds Dockerfiles if missing, and outputs ready-to-commit workflow YAML. Supports Node, Python, and static site presets.'
      ],
      array[
        'Single YAML config drives Docker build and GitHub Actions workflow generation',
        'Preset templates for Node, Python, and static sites — no Dockerfile expertise needed',
        'Dry-run mode shows generated files without writing to disk',
        'Used internally to cut deploy setup time from ~2 hours to 10 minutes'
      ],
      array['TypeScript', 'Node.js', 'Docker', 'GitHub Actions'],
      'https://github.com', '#', 2);
end $$;
