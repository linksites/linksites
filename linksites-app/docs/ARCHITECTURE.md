# LinkSites App Architecture

## Goal

Build the SaaS layer of LinkSites as a dedicated application for creator pages, professional mini sites, and link-in-bio pages.

## Boundaries

- `linksites/` keeps the public landing and marketing site
- `linksites-app/` owns product, auth, dashboard, and database integration

## Core flows

1. User signs up
2. User creates a profile
3. User customizes bio, avatar, theme, and links
4. User publishes a public page
5. Visitors open `/u/:username`
6. Public visits and link clicks are stored as analytics events
7. The dashboard shows onboarding progress and performance summary

## App structure

- `src/app/page.tsx`
  Product-facing entry page
- `src/app/dashboard/page.tsx`
  Creator editor MVP with onboarding and analytics summary
- `src/app/api/analytics/route.ts`
  Public analytics ingestion endpoint
- `src/app/u/[username]/page.tsx`
  Public profile page and analytics capture surface
- `src/components/`
  Reusable UI and preview components
- `src/lib/`
  Supabase clients, mock data, shared types, analytics, onboarding, and data loaders
- `supabase/schema.sql`
  Database schema and RLS

## Data model

### profiles

- one row per creator or brand
- linked to `auth.users`
- stores username, display name, bio, avatar, theme, publish status

### links

- belongs to a profile
- stores title, URL, position, active state

### themes

- preset theme catalog
- used by profile pages and dashboard preview

### analytics_events

- belongs to a profile
- stores `profile_view` and `link_click`
- keeps session id, path, referrer, and top link context

## Auth strategy

- Supabase Auth for email and magic link initially
- middleware and protected routes later
- dashboard pages should require an authenticated session

## Rendering strategy

- server rendering for public profile routes
- client components only where interaction is required
- fallback to mock data when Supabase env vars are not configured

## Security

- Row Level Security enabled on product tables
- only owners can manage their profiles and links
- public visitors can read published profiles and active links only
- public visitors can insert analytics events only for published profiles
- only owners can read their own analytics events

## Milestones

### Phase 1

- app scaffold
- schema
- public profile route
- dashboard skeleton

### Phase 2

- auth
- persistence
- image upload
- onboarding
- analytics

### Phase 3

- custom domains
- plans and billing
- follows and social discovery
