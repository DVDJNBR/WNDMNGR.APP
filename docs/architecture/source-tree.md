# Project Source Tree (Target Unified Architecture)

This document outlines the intended directory structure for the unified SvelteKit application on Cloudflare.

## Root Directory
- `.bmad-core/`: BMAD Method configuration and agent definitions.
- `docs/`: Project documentation (PRD, Architecture, Stories).
- `legacy/`: Archived codebases (original Python app and previous split-app attempts).
- `RESOURCES/`: Reference documents and handoff materials.
- `src/`: Core SvelteKit application source.
- `static/`: Static assets (icons, images).
- `package.json`: Project dependencies and scripts.
- `svelte.config.js`: SvelteKit configuration (using adapter-cloudflare).
- `wrangler.toml`: Cloudflare Pages deployment configuration.
- `tsconfig.json`: TypeScript configuration.

## Application Source (`src/`)
- `app.html`: Base HTML template.
- `app.d.ts`: Global TypeScript definitions, including Cloudflare `Platform` types.
- `hooks.server.ts`: **Security Layer**. Implements the Cloudflare Access header validation and identity propagation.

### Library (`src/lib/`)
- `components/`:
    - `ui/`: Generic reusable UI components.
    - `viz/`: Specialized dashboard visualization components (charts, stats).
- `server/`: **Server-Side Only**.
    - `supabase.ts`: Initialized Supabase client using server-side environment variables.
    - `db/`: Modular database query logic (extracted from ported SQL queries).
- `types/`: Shared TypeScript interfaces for Domain models (Farms, Turbines, etc.).

### Routes (`src/routes/`)
- `+layout.svelte`: Global layout (navigation, breadcrumbs, user profile).
- `+page.svelte`: Root landing page / redirection logic based on auth status.
- `dashboard/`:
    - `+page.server.ts`: Loads operational data via SSR using ported queries.
    - `+page.svelte`: Main visualization view.
- `farms/`:
    - `+page.server.ts`: List view data loader.
    - `+page.svelte`: Farm management list view.
    - `new/`: The "Add Farm" multi-step wizard.
    - `[uuid]/`:
        - `+page.server.ts`: Individual farm data loader and form actions.
        - `+page.svelte`: Farm edit/view interface.
- `api/`:
    - `v1/`: REST API endpoints for future integrations (Rotorsoft/Scrapers).

## Implementation Rules
1. **SSR First**: All sensitive data fetching must happen in `*.server.ts` files.
2. **Type Safety**: Use Zod for validation of environment variables and form inputs.
3. **Environment**: Use SvelteKit `$env/static/private` for sensitive keys (Supabase role key).