# LinkSites App

`linksites-app` is the SaaS product layer for LinkSites.

This app is intentionally separate from the public landing page so we can evolve the product without coupling marketing pages, dashboard flows, auth, and database concerns to the GitHub Pages site.

## Product direction

Initial product model:

- public profile pages, similar to Linktree
- creator dashboard to edit avatar, bio, theme, and links
- username-based public routes
- auth and storage with Supabase
- Postgres with row level security

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage

## Local setup

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase project URL and publishable key
3. Run:

```bash
npm install
npm run dev
```

If Supabase env vars are missing, the app falls back to mock data so the UI can still be reviewed.

## Current routes

- `/` product entry page
- `/dashboard` creator editor MVP
- `/u/demo` public profile preview

## Database

The initial schema is in:

- `supabase/schema.sql`

It includes:

- `profiles`
- `links`
- `themes`
- helper trigger for `updated_at`
- basic RLS policies

## Next steps

- connect dashboard forms to server actions
- add Supabase Auth sign in and sign up
- persist profile changes
- support drag-and-drop link sorting
- add analytics and click tracking
- add paid plans and billing
