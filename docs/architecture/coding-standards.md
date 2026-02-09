# Coding Standards (SvelteKit/TypeScript)

## TypeScript & Svelte
*   **Typing**: Strict mode enabled. Define interfaces for all Data models.
*   **Svelte Components**: Use `<script lang="ts">`. Follow the "one component per file" rule.
*   **Props**: Use `export let` (Svelte 4 style) or `$props()` (Svelte 5 runes) as appropriate for the version chosen.

## Data Fetching (SSR)
*   **Loaders**: Use `+page.server.ts` or `+layout.server.ts` for all database interactions.
*   **Actions**: Use SvelteKit Form Actions for all mutations (Create/Update/Delete).
*   **Security**: Never expose the Supabase `SERVICE_ROLE_KEY` to the client.

## Folder Structure
*   `src/lib/server`: Server-only logic (DB clients, utilities).
*   `src/lib/components`: Shared UI components.
*   `src/routes`: SvelteKit routing tree.

## CSS / Styling
*   **Utility-First**: Use Tailwind CSS classes.
*   **Consistency**: Follow the project's color palette (inspired by legacy Streamlit/Taipy designs).

## Error Handling
*   **Server Errors**: Use SvelteKit's `error()` helper.
*   **Form Validation**: Use Zod for server-side validation.