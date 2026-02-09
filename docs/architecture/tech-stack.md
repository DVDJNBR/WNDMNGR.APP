# Technology Stack (Unified SvelteKit)

## Core Framework
*   **Framework**: SvelteKit 2.x
*   **Language**: TypeScript 5.x
*   **Styling**: Tailwind CSS
*   **Runtime**: Cloudflare Pages (Workers runtime)

## Authentication & Security
*   **Identity Provider**: Microsoft Entra ID (via Azure App Registration)
*   **Access Control**: Cloudflare Access (Zero Trust)
*   **Application Auth**: SvelteKit Hook checking for Cloudflare JWT/Headers

## Database & Data
*   **Database**: Supabase (PostgreSQL)
*   **Client**: `@supabase/supabase-js` (Server-side usage)
*   **SQL Logic**: Ported from Evidence.dev queries

## Infrastructure & Deployment
*   **Hosting**: Cloudflare Pages
*   **Adapter**: `@sveltejs/adapter-cloudflare`
*   **CI/CD**: GitHub Actions

## Key Libraries
*   `lucide-svelte`: Icons
*   `chart.js` or `layerchart`: Data visualization
*   `zod`: Schema validation for forms and API routes