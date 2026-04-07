# BuildSpace - Developer Collaboration Platform

A responsive web application that brings together developer profiles, project collaboration, and opportunity discovery into a unified platform.

**Built for SDC Hack Week 2026**

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **Backend**: Supabase (Auth, PostgreSQL, Realtime, Storage)
- **UI**: Custom component library (shadcn-inspired), Lucide Icons
- **Deployment**: Vercel

## Features

### Developer Profiles
- Create and edit profiles with skills, interests, and social links
- Avatar upload with Supabase Storage
- Public profile pages with shareable URLs
- Skills and interests tag system with autocomplete

### Project & Team Formation
- Create projects with descriptions and tech stacks
- Browse and search projects with filters (status, tech stack)
- Join projects and manage team members
- Project status management (Open / In Progress / Completed)

### Opportunity Board
- Post opportunities (Looking for Teammates / Hiring / Hackathon Teams)
- Tab-based filtering by opportunity type
- Interest system - express interest and connect
- Author dashboard to see interested users

### Interactive Dashboard
- Personalized greeting with profile stats
- Community activity feed with real-time updates
- Trending projects and latest opportunities widgets
- Quick action buttons for creating content

### Additional Features
- Dark/Light mode with system preference detection
- Global search (Cmd+K) across profiles, projects, and opportunities
- Real-time notifications for project joins and opportunity interest
- Fully responsive design (mobile + desktop)
- Toast notifications for user actions

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/buildspace.git
cd buildspace
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
- Go to your Supabase dashboard > SQL Editor
- Run the migration file: `supabase/migrations/001_initial_schema.sql`
- Create a storage bucket named `avatars` (set to public)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
  app/
    (auth)/          # Login, signup, callback
    (dashboard)/     # Main app (dashboard, projects, opportunities, settings)
    profile/         # Public profile pages
    onboarding/      # New user onboarding
  components/
    ui/              # Reusable UI components (Button, Card, Input, Badge, etc.)
    layout/          # Navbar, Sidebar, Search, Notifications, Theme
    profile/         # Profile card components
    projects/        # Project card components
    opportunities/   # Opportunity card components
    feed/            # Activity feed components
  lib/
    supabase/        # Supabase client utilities (browser, server, middleware)
    utils.ts         # Utility functions (cn, timeAgo, getInitials)
    constants.ts     # App constants (skills, interests, statuses)
  types/             # TypeScript interfaces
supabase/
  migrations/        # SQL schema files
  seed.sql           # Demo data template
```

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | User profiles with skills, interests, and links |
| `projects` | Projects with tech stacks and status |
| `project_members` | Team membership tracking |
| `opportunities` | Teammate search, hiring, hackathon posts |
| `opportunity_interests` | Interest expression tracking |
| `feed_events` | Community activity feed data |
| `notifications` | User notification system |
