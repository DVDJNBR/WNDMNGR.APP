# Technical Spec: Schema Discovery & Metadata

## Overview
This specification defines how the application automatically discovers the database schema and integrates trilingual metadata (FR/EN/DE) for documentation purposes.

## 1. Database Schema Metadata Table
This table stores the human-readable descriptions for tables and columns.

```sql
CREATE TABLE IF NOT EXISTS public._schema_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    column_name TEXT, -- NULL if the description is for the table itself
    description_fr TEXT,
    description_en TEXT,
    description_de TEXT,
    description_es TEXT, -- Added for future use / Easter egg
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(table_name, column_name)
);

-- Enable RLS (Read only for authenticated users)
ALTER TABLE public._schema_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read access" ON public._schema_metadata
    FOR SELECT TO authenticated USING (true);
```

## 2. Schema Discovery RPC
This function returns a JSON structure containing everything needed for Svelte Flow.

```sql
CREATE OR REPLACE FUNCTION get_schema_with_metadata()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'tables', (
            SELECT json_agg(t) FROM (
                SELECT 
                    cols.table_name,
                    json_agg(
                        json_build_object(
                            'column_name', cols.column_name,
                            'data_type', cols.data_type,
                            'is_nullable', cols.is_nullable,
                            'description_fr', meta.description_fr,
                            'description_en', meta.description_en,
                            'description_de', meta.description_de,
                            'description_es', meta.description_es
                        )
                    ) as columns
                FROM information_schema.columns cols
                LEFT JOIN public._schema_metadata meta 
                    ON cols.table_name = meta.table_name 
                    AND cols.column_name = meta.column_name
                WHERE cols.table_schema = 'public'
                  AND cols.table_name NOT LIKE '\_%' -- Exclude metadata tables
                GROUP BY cols.table_name
            ) t
        ),
        'relations', (
            SELECT json_agg(r) FROM (
                SELECT
                    tc.table_name AS source_table,
                    kcu.column_name AS source_column,
                    ccu.table_name AS target_table,
                    ccu.column_name AS target_column
                FROM information_schema.table_constraints AS tc
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
                WHERE tc.constraint_type = 'FOREIGN KEY' 
                  AND tc.table_schema = 'public'
            ) r
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 3. Implementation Plan for Dev
1. **Apply SQL**: Execute the above script in Supabase SQL Editor.
2. **API Call**: Use `supabase.rpc('get_schema_with_metadata')` in the SvelteKit load function.
3. **Mapping**: Convert the returned JSON into Svelte Flow `nodes` and `edges`.
    - `nodes`: One node per table, containing a list of columns.
    - `edges`: One edge per relation found.
