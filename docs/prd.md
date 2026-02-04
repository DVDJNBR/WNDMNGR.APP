# WNDMNGR Modernization PRD

## 1. Intro Project Analysis and Context

### Analysis Source
*   **Source**: Analysis of existing codebase (`app_streamlit_legacy.py`, `auth.py`, `database.py`) and user interaction, incorporating B2 API REST certification requirements.

### Current Project State
The project is a Wind Farm Management application ("WNDMNGR") initially built with Streamlit. It currently uses a Facade pattern for database access (SQLite/Supabase) and similarly split authentication (Mock/Supabase). The goal is to modernize and transform it into a robust, enterprise-ready application with a decoupled frontend and backend.

### Enhancement Scope
*   **Type**: Tech Stack Upgrade (Legacy Streamlit -> Next.js Frontend + Cloudflare Worker Backend), Infrastructure (-> Cloudflare Pages/Workers), Auth (-> Entra ID), and New Features, driven by B2 API REST certification.
*   **Impact**: Major Impact. Requires rebuilding both the UI layer and the backend API, alongside refactoring the Authentication and Configuration layers.

### Goals
*   Migrate to a modern, decoupled architecture: **Next.js** for the frontend, **Cloudflare Worker (TypeScript)** for the backend API.
*   Implement **Microsoft Entra ID** authentication.
*   Deploy **frontend to Cloudflare Pages** and **backend to Cloudflare Workers**.
*   Satisfy **B2 API REST certification requirements** (C8-C12), including comprehensive API endpoints, authentication, data aggregation, and OpenAPI documentation.
*   Add "Add Farm" Wizard and Cascading Delete.
*   Display Database Documentation in-app.

---

## 2. Requirements

### Functional Requirements
*   **FR1**: The frontend must run on **Next.js** with a responsive layout.
*   **FR2**: The backend must expose a **REST API** via **Cloudflare Workers (TypeScript)**.
*   **FR3**: Production Authentication must support **Microsoft Entra ID**.
*   **FR4**: The REST API must provide endpoints for **CRUD operations** (Create, Read, Update, Delete) on farm data.
*   **FR5**: The REST API must implement **data extraction, aggregation, and transformation** capabilities (C8, C9, C10 from B2 Ref).
*   **FR6**: The REST API must provide **OpenAPI (Swagger) documentation** (C12 from B2 Ref).
*   **FR7**: "Add Farm" feature must be a multi-step **Wizard** preventing incomplete data entry.
*   **FR8**: Users must be able to **View and Edit** all farm data categories (General, Contacts, etc.) via the frontend interacting with the API.
*   **FR9**: A "Hidden" or Admin-only **Cascading Delete** must allow removal of a farm and all dependencies via the API.
*   **FR10**: Contact cards must feature a **"Send Email"** button.
*   **FR11**: A **Documentation Tab** must display the database schema and metadata.

### Non-Functional Requirements
*   **NFR1**: Frontend deployable to **Cloudflare Pages**.
*   **NFR2**: Backend API deployable to **Cloudflare Workers**.
*   **NFR3**: Minimal cold start times for the backend API.
*   **NFR4**: Configuration managed via environment variables and Cloudflare secrets.
*   **NFR5**: UI response time for edits (via API calls) should be immediate (<200ms) where possible.
*   **NFR6**: API must adhere to **RESTful principles** and security best practices.

### Compatibility Requirements
*   **CR1**: The API should support existing Supabase RLS policies (if any).
*   **CR2**: Local development should allow mock data or local database access without full Cloudflare deployment.

---

## 3. Technical Constraints

### Integration Approach
*   **Auth**: Microsoft Entra ID authentication handled by the Cloudflare Worker backend using `msal-node`. Frontend will consume authentication tokens from the API.
*   **Config**: Environment variables for Cloudflare Workers/Pages, potentially `.env` for local development.
*   **DB**: Supabase (PostgreSQL) accessed by the Cloudflare Worker backend via a TypeScript client.

### Deployment
*   **Frontend**: Next.js application built for static export or server-side generation on Cloudflare Pages.
*   **Backend**: Cloudflare Worker (TypeScript) packaged for the Workers runtime.

---

## 4. Epic Details: WNDMNGR Cloudflare Modernization

**Epic Goal**: Transform WNDMNGR into an enterprise-ready, decoupled application using Next.js and Cloudflare Workers, fully hosted on Cloudflare, and compliant with B2 API REST certification requirements.

### Story Sequence (High-Level Epics)

#### Epic: Backend API (Cloudflare Worker / TypeScript)
**Goal**: Establish a robust, secure, and performant REST API on Cloudflare Workers, satisfying B2 certification.
*   **Setup**: Initialize Cloudflare Worker project with Hono, TypeScript, and necessary tooling.
*   **Authentication**: Implement Microsoft Entra ID authentication flow (OAuth 2.0/OIDC) using `msal-node`.
*   **Database Integration**: Connect to Supabase (PostgreSQL) securely; implement data access layer.
*   **B2 API Endpoints**: Develop all required CRUD endpoints for farm data, implementing C8, C9, C10 logic (extraction, SQL queries, aggregation).
*   **API Documentation**: Integrate OpenAPI (Swagger) generation for API endpoints (C12).

#### Epic: Frontend Application (Next.js)
**Goal**: Develop a modern, responsive, and user-friendly frontend using Next.js, interacting with the new API.
*   **Setup**: Initialize Next.js project with TypeScript and a UI component library (e.g., Material-UI).
*   **Authentication Integration**: Implement client-side logic for Microsoft Entra ID login and token management.
*   **UI Recreation**: Rebuild the main application interface, dashboards, and data display screens, inspired by the previous Taipy/Streamlit design.
*   **Farm Management Features**: Implement "Add Farm" Wizard, View/Edit farm details, and Cascading Delete (FR7, FR8, FR9 from Requirements).
*   **Email & Documentation**: Implement "Send Email" button and "Documentation Tab" to display schema (FR10, FR11).

#### Epic: Deployment & Infrastructure (Cloudflare Pages/Workers)
**Goal**: Establish seamless and efficient deployment pipelines for both frontend and backend on Cloudflare.
*   **Frontend Deployment**: Configure Next.js project for deployment to Cloudflare Pages (e.g., static export).
*   **Backend Deployment**: Configure Cloudflare Worker project for deployment to Cloudflare Workers.
*   **Environment Configuration**: Manage environment variables and secrets across Cloudflare Pages and Workers.
*   **CI/CD**: Set up continuous integration and deployment workflows for both frontend and backend.