# Epic: Interactive Multilingual Documentation - Brownfield Enhancement

## Epic Goal
Provide an interactive, DrawDB-style database schema documentation within the application, supporting French, English, and German descriptions to facilitate cross-border team collaboration.

## Epic Description

**Existing System Context:**
- Current relevant functionality: A "Database Documentation" link exists in the sidebar of the data page but leads to a 404.
- Technology stack: Svelte 4, Tailwind CSS, Supabase (PostgreSQL).
- Integration points: Sidebar navigation, new `/docs` route.

**Enhancement Details:**
- What's being added/changed: A new interactive documentation module with a schema visualizer and multilingual metadata.
- How it integrates: Sidebar will be refactored into a shared component; a new route `/docs` will host the documentation.
- Success criteria: 
    - Interactive schema viewable with tables and joins.
    - Toggle between EN, FR, and DE for metadata descriptions.
    - Accessible from the main sidebar.

## Stories

1. **Story 1: Docs Route & Sidebar Componentization**
   - Refactor the hardcoded sidebar in `src/routes/data/+page.svelte` into a shared component.
   - Create the `/docs` route and layout.
   - Add a "Documentation" nav item in the sidebar.

2. **Story 2: Interactive Schema Visualization**
   - Implement a logical schema view using **Svelte Flow** (or similar).
   - Display tables as nodes and joins as edges.
   - Ensure basic interactivity (pan/zoom).

3. **Story 3: Multilingual Metadata & Hover Details**
   - Setup a metadata storage strategy (JSON/YAML) for trilingue descriptions.
   - Implement a language switcher (flags) in the UI.
   - Add hover/click functionality to show column descriptions in the selected language.

## Compatibility Requirements
- [x] Existing APIs remain unchanged.
- [x] Database schema changes are backward compatible (no DB changes planned, metadata will be external).
- [x] UI changes follow existing patterns (Tailwind, Lucide icons).
- [x] Performance impact is minimal (lazy loading the schema visualizer).

## Risk Mitigation
- **Primary Risk:** Complexity of visualizing a large schema could impact performance or UX.
- **Mitigation:** Start with a logical/simplified view; use lazy loading for the visualization library.
- **Rollback Plan:** Remove the `/docs` route and revert sidebar changes.

## Definition of Done
- [ ] All stories completed with acceptance criteria met.
- [ ] Documentation page is accessible and functional.
- [ ] Multi-language switching works for all metadata.
- [ ] No regression in the main dashboard or data pages.

---

**Story Manager Handoff:**
"Please develop detailed user stories for this brownfield epic. Key considerations:
- This is an enhancement to a Svelte 4 project.
- Integration points: Sidebar refactoring is a priority to avoid duplication.
- Existing patterns to follow: Tailwind CSS for styling, Lucide-Svelte for icons.
- Critical compatibility requirements: Must support EN/FR/DE switching for documentation only (UI/DB remains in current state or follows).
- Each story must include verification that existing functionality remains intact."
