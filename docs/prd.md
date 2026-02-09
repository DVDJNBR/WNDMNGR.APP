# WNDMNGR Unified Platform PRD

## 1. Intro Project Analysis and Context

### Analysis Source
*   **Source**: Analysis of legacy codebase and strategic pivot toward a unified SvelteKit application on Cloudflare.

### Current Project State
The project is transitioning from a fragmented architecture (Streamlit/Next.js CRUD + Evidence.dev Dashboard) to a **unified SvelteKit application**. The goal is to provide a single, secure, and performant platform for both Farm Management (CRUD) and Operational Dashboards.

### Enhancement Scope
*   **Type**: Tech Stack Pivot (SvelteKit SSR), Infrastructure (Cloudflare Pages), Auth (Cloudflare Access / Microsoft Entra ID), and Unified Dashboard/CRUD.
*   **Impact**: Major Impact. Requires a unified codebase to replace legacy fragments.

### Goals
*   Implement a **Unified SvelteKit Platform** hosted on **Cloudflare Pages**.
*   Utilize **Cloudflare Access** with **Microsoft Entra ID** for authentication (restricting access to `@wpd.fr`).
*   Integrate **Supabase (PostgreSQL)** for data storage using server-side fetching (SSR) to ensure data security.
*   Port existing **Evidence.dev SQL queries** and dashboard logic into SvelteKit.
*   Maintain **B2 API REST certification** readiness through structured API routes.
*   Future-proof for **Rotorsoft API** integration and maintenance report scraping/ingestion.

---

## 2. Requirements

### Functional Requirements
*   **FR1**: The application must be built with **SvelteKit** using **SSR** for secure data handling.
*   **FR2**: **Authentication** must be handled by **Cloudflare Access** integrated with **Microsoft Entra ID**.
*   **FR3**: The platform must feature a **Dashboard** displaying farm stats, status, and turbine details (porting queries from `dashboard-handoff.md`).
*   **FR4**: The platform must provide **CRUD operations** for farm data management.
*   **FR5**: Implement a multi-step **"Add Farm" Wizard** to ensure data quality.
*   **FR6**: A **Cascading Delete** feature must be available for administrative users.
*   **FR7**: Support future **Data Ingestion** from Rotorsoft and maintenance reports.

### Non-Functional Requirements
*   **NFR1**: Deployment to **Cloudflare Pages** using `adapter-cloudflare`.
*   **NFR2**: **Security**: No database connection strings or sensitive data exposed to the client.
*   **NFR3**: **Performance**: Optimize for Cloudflare edge performance and minimal cold starts.
*   **NFR4**: **Maintainability**: Unified TypeScript codebase for both frontend and backend logic.

### Compatibility Requirements
*   **CR1**: Must work with existing **Supabase** schema.
*   **CR2**: Local development must support environment variable masking for Cloudflare Access headers.

---

## 3. Technical Constraints

### Integration Approach
*   **Auth**: Cloudflare Access (Zero Trust) verifies Entra ID identity. SvelteKit reads identity headers (e.g., `Cf-Access-Authenticated-User-Email`).
*   **DB**: Supabase accessed via server-side loaders and actions in SvelteKit.
*   **Hosting**: Cloudflare Pages.

---

## 4. Epic Details: SvelteKit Unified Platform

### Story Sequence (High-Level)

#### Epic 1: Scaffolding & Security
*   Initialize SvelteKit with Tailwind CSS and Cloudflare Adapter.
*   Configure Cloudflare Access and verify identity propagation to SvelteKit.
*   Setup Supabase client and server-side connection pooling.

#### Epic 2: Operational Dashboard
*   Implement Farm Selection logic.
*   Port SQL queries for Farm Info, Localisation, Status, and Turbines.
*   Build responsive visualization components for farm data.

#### Epic 3: Farm Management (CRUD)
*   Implement List and View screens for farms.
*   Develop the "Add Farm" multi-step Wizard.
*   Implement Edit and Cascading Delete functionality.

#### Epic 4: Advanced Data & Documentation
*   Implement Documentation tab for DB schema.
*   Prepare API routes for Rotorsoft/Scraper integration.
