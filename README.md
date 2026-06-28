# GermanyMove Checklist

GermanyMove Checklist is a full-stack relocation planning app for newcomers from India, Pakistan, and Bangladesh who are preparing to move to Germany.

The app generates a personalized moving checklist based on a user's country, purpose of stay, destination city, visa stage, and arrival date. Users can track progress, save notes for each task, and ask for simple AI explanations of confusing relocation tasks such as Anmeldung, health insurance, bank accounts, residence permits, and visa preparation.

## Why This Project Exists

Moving to Germany can be overwhelming, especially when people must understand visa steps, city registration, insurance, housing, banking, and local bureaucracy at the same time. GermanyMove Checklist turns that process into a structured, trackable workflow.

The MVP is designed to be useful even before login: users can generate a checklist, mark tasks complete, add notes, and keep progress locally. Logged-in users can sync their profile and task progress through Supabase.

## Key Features

- Personalized checklist generation
- Country, purpose, city, visa stage, and arrival-date based task rules
- Progress tracking with grouped task categories
- Mark and unmark tasks as completed
- Per-task notes
- Local storage support for no-login usage
- Supabase authentication
- Supabase-backed user profiles and task progress
- Row-level security policies for user-owned data
- AI-powered task explanations using the OpenAI Responses API
- Sentry monitoring for frontend, API, AI, and Supabase errors
- Clean, responsive UI built with accessible form controls

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Supabase Auth |
| Database | Supabase Postgres |
| Local persistence | localStorage |
| AI | OpenAI Responses API |
| Monitoring | Sentry |
| Deployment target | Vercel-ready |

## Product Flow

1. A user starts on the landing page.
2. They answer onboarding questions:
   - Country: India, Pakistan, or Bangladesh
   - Purpose: Study, Work, or Family Reunion
   - City: Berlin, Munich, Hamburg, Frankfurt, or Other
   - Stage: Before visa, Visa approved, or Arrived in Germany
   - Arrival date
3. The app generates a personalized checklist from rule-based seed data.
4. The user tracks progress, adds notes, and expands task details.
5. If logged in, progress is synced to Supabase.
6. The user can ask AI to explain a task in simple English.

## Architecture

```text
Next.js App Router
  |
  |-- Landing page
  |-- Onboarding form
  |-- Dashboard
  |-- Login
  |-- API route: /api/ai/explain-task
  |
Supabase
  |-- Auth
  |-- profiles
  |-- checklist_tasks
  |-- user_tasks
  |-- Row-level security
  |
OpenAI Responses API
  |-- Task explanations
  |-- Safe official-source reminders
  |
Sentry
  |-- Frontend error monitoring
  |-- API route monitoring
  |-- AI failure monitoring
  |-- Supabase failure monitoring
```

## Database Design

The Supabase schema includes:

- `profiles`: stores each user's relocation profile
- `checklist_tasks`: prepared for future database-managed checklist rules
- `user_tasks`: stores generated user-specific tasks, completion status, and notes

Row-level security is enabled so users can only read and update their own profile and task data.

Schema file:

```text
supabase/schema.sql
```

## AI Explanation Feature

Each task includes an **Explain this task** action. The app sends the task title, task description, user profile, and optional user question to a Next.js API route.

The API returns:

- Simple explanation
- Why the task matters
- Steps to complete it
- Common mistakes
- Official-source reminder for visa, residence, Anmeldung, or legal-related tasks

Model names are not hardcoded. They are controlled by environment variables:

```env
OPENAI_DEFAULT_MODEL=
OPENAI_ESCALATION_MODEL=
```

## Privacy and Safety

This app intentionally avoids sending sensitive user data to monitoring tools.

Sentry is configured not to log:

- API keys
- cookies
- request headers
- personal notes
- raw user profile payloads
- immigration documents
- raw OpenAI error bodies

AI responses include reminders to verify legal, visa, registration, and residence-related information with official German sources.

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd App_imigermany
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Copy the example file:

```bash
cp .env.local.example .env.local
```

Then add your values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=
OPENAI_DEFAULT_MODEL=
OPENAI_ESCALATION_MODEL=

NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ENVIRONMENT=development
```

`SUPABASE_SERVICE_ROLE_KEY` is included for future server-only use. Do not expose it in client components.

### 4. Set up Supabase

Run the SQL in:

```text
supabase/schema.sql
```

This creates the tables and row-level security policies.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 6. Build for production

```bash
npm run build
```

## Project Structure

```text
app/
  api/ai/explain-task/     AI explanation API route
  dashboard/               Checklist dashboard
  login/                   Supabase auth page
  onboarding/              Profile onboarding flow

components/
  Button.tsx
  DashboardChecklist.tsx
  Input.tsx
  LoginForm.tsx
  OnboardingForm.tsx
  PageHeader.tsx
  ProgressBar.tsx
  Select.tsx
  TaskCard.tsx

src/
  data/checklistRules.ts   Seed rules and checklist generation logic
  lib/checklistStorage.ts  Local storage helpers
  lib/monitoring.ts        Safe Sentry wrappers
  lib/supabaseChecklist.ts Supabase task/profile sync

supabase/
  schema.sql               Database schema and RLS policies
```

## Current MVP Scope

Implemented:

- Checklist generation
- Local progress tracking
- Supabase auth and persistence
- AI task explanations
- Sentry monitoring
- RLS database schema

Not included yet:

- Admin checklist editor UI
- Document upload and document explanation
- Vector search or RAG
- Email reminders
- Multi-language UI
- Production seed script for `checklist_tasks`

## Future Improvements

- Admin dashboard for managing checklist rules
- Store checklist rules directly in Supabase
- Add reminders for due tasks
- Add multilingual support for Hindi, Urdu, Bengali, and German
- Add official-source links per task
- Add document explanation with strict privacy controls
- Add automated tests for checklist generation and API routes
- Add Vercel deployment configuration

## Recruiter Notes

This project demonstrates:

- Full-stack product thinking
- Modern Next.js App Router development
- TypeScript-first implementation
- Practical Supabase Auth and Postgres usage
- Row-level security awareness
- AI integration through a server-side API route
- Privacy-conscious monitoring with Sentry
- Clean component structure
- MVP-focused product execution

## License

This project is currently for portfolio and learning purposes.
