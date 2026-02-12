# UI/UX Specification: Interactive Documentation

## 1. Visual Theme & Tables (Nodes)
- **Thematic Coloring**: Tables should be color-coded by "theme" or "domain" (e.g., all "Farm" related tables in Green, "User/Auth" in Blue, "Production/Data" in Orange).
- **Node Structure**:
    - **Header**: Table name in bold with the theme color as background.
    - **Body**: White background, list of columns with Lucide icons (Key for PK, Link for FK).
- **Interactivity**: 
    - Hovering a node highlights it and its immediate relations.
    - Clicking a node focuses it and opens the **Detail Panel**.

## 2. Control Panel (Top Right)
- **Language Switcher**: Floating panel with circular pills. Each pill shows the flag + the language code (FR, EN, DE).
- **Easter Egg**: The Spanish (ES) language is available in the data but hidden by default (accessible via a specific interaction or simply present in the code for future use).
- **Navigation Controls**: 
    - `Zoom to Fit` icon.
    - `Auto-layout` icon (to re-organize nodes).

## 3. Metadata Display
- **Quick Hover (Tooltip)**: When hovering a column name, a sleek tooltip appears with the description in the active language.
- **Detail Panel (Side Drawer)**: 
    - Slides in from the right upon clicking a table or column.
    - Displays: Full table/column name, Data Type, Nullability, and the trilingual descriptions.

## 4. Sidebar Integration
- **Placement**: Bottom of the sidebar, just above the logout button.
- **Style**: Subtle but accessible, using the `BookOpen` or `Database` Lucide icon.
- **Pattern**: Matches the existing sidebar typography and hover states.
