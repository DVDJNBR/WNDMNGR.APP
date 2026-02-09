# System Architecture: Unified WNDMNGR

## Overview
The WNDMNGR application is a unified platform for wind farm management and data visualization. It is architected as a server-side rendered (SSR) application using SvelteKit, deployed on Cloudflare Pages.

## Core Components

### 1. Security Layer (Cloudflare Access)
Access to the application is gated by Cloudflare Access. 
- **Identity**: Microsoft Entra ID.
- **Enforcement**: Only users with `@wpd.fr` email addresses are permitted.
- **Context**: SvelteKit receives identity context via headers, which are validated in `hooks.server.ts`.

### 2. Application Layer (SvelteKit)
- **Frontend**: Svelte components styled with Tailwind CSS.
- **Backend (SSR)**: SvelteKit loaders and actions running on Cloudflare Workers.
- **API Routes**: Standardized REST endpoints for external integrations (Rotorsoft, Scrapers).

### 3. Data Layer (Supabase)
- **Primary DB**: PostgreSQL on Supabase.
- **Connectivity**: SvelteKit connects to Supabase server-side. RLS (Row Level Security) is used as a secondary safety measure.

## Data Flow
1. **Request**: User navigates to a route.
2. **Auth Check**: Cloudflare Access validates the session/JWT.
3. **SSR**: SvelteKit `load` function runs on the edge, fetches data from Supabase.
4. **Render**: SvelteKit renders the HTML and streams it to the user.
5. **Hydration**: Svelte hydrates the page for client-side interactivity (Dashboards/Forms).

## Future Integrations
- **Rotorsoft**: A dedicated service or SvelteKit route will poll the Rotorsoft API and sync data to Supabase.
- **Maintenance Scraper**: Transformation logic will be implemented as server-side utilities or Cloudflare Cron Workers.
