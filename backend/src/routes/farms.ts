import { Hono } from 'hono'
import { Env } from '../config/auth'
import { User } from '../middleware/auth'
import { getSupabaseClient, Farm } from '../lib/supabase'

// Farm with joined type name
interface FarmWithType extends Farm {
  farm_types?: {
    type_title: string
  }
}

// Input validation for create/update
interface FarmInput {
  spv: string
  project: string
  code: string
  farm_type_id: number
}

function validateFarmInput(data: unknown): { valid: true; data: FarmInput } | { valid: false; errors: string[] } {
  const errors: string[] = []
  const input = data as Record<string, unknown>

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object'] }
  }

  if (!input.spv || typeof input.spv !== 'string') {
    errors.push('spv is required and must be a string')
  }
  if (!input.project || typeof input.project !== 'string') {
    errors.push('project is required and must be a string')
  }
  if (!input.code || typeof input.code !== 'string') {
    errors.push('code is required and must be a string')
  }
  if (!input.farm_type_id || typeof input.farm_type_id !== 'number') {
    errors.push('farm_type_id is required and must be a number (1=Wind, 2=Solar, 3=Hybrid)')
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    data: {
      spv: input.spv as string,
      project: input.project as string,
      code: input.code as string,
      farm_type_id: input.farm_type_id as number
    }
  }
}

const farms = new Hono<{
  Bindings: Env
  Variables: { user: User }
}>()

// GET /farms - List all farms
farms.get('/', async (c) => {
  try {
    const supabase = getSupabaseClient(c.env)

    const { data, error } = await supabase
      .from('farms')
      .select(`
        uuid,
        spv,
        project,
        code,
        farm_type_id,
        farm_types (
          type_title
        )
      `)
      .order('code', { ascending: true })

    if (error) {
      return c.json({ error: 'Failed to fetch farms', details: error.message }, 500)
    }

    return c.json({
      farms: data,
      count: data?.length || 0
    })

  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'Unknown error' }, 500)
  }
})

// GET /farms/stats - Global statistics (B2: C9, C10)
farms.get('/stats', async (c) => {
  try {
    const supabase = getSupabaseClient(c.env)

    // Get farm counts by type
    const { data: farms, error: farmsError } = await supabase
      .from('farms')
      .select('farm_type_id, farm_types(type_title)')

    if (farmsError) {
      return c.json({ error: 'Failed to fetch stats', details: farmsError.message }, 500)
    }

    // Aggregate by type
    const byType: Record<string, number> = {}
    farms?.forEach((farm: any) => {
      const typeName = farm.farm_types?.type_title || 'Unknown'
      byType[typeName] = (byType[typeName] || 0) + 1
    })

    // Get turbine details for power calculation
    const { data: turbineDetails, error: turbineError } = await supabase
      .from('farm_turbine_details')
      .select('turbine_count, total_mmw')

    let totalTurbines = 0
    let totalPowerMW = 0

    if (!turbineError && turbineDetails) {
      turbineDetails.forEach((td: any) => {
        totalTurbines += td.turbine_count || 0
        totalPowerMW += td.total_mmw || 0
      })
    }

    return c.json({
      totalFarms: farms?.length || 0,
      byType,
      totalTurbines,
      totalPowerMW: Math.round(totalPowerMW * 100) / 100
    })

  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'Unknown error' }, 500)
  }
})

// GET /farms/:uuid - Get single farm with related data
farms.get('/:uuid', async (c) => {
  const uuid = c.req.param('uuid')

  try {
    const supabase = getSupabaseClient(c.env)

    const { data, error } = await supabase
      .from('farms')
      .select(`
        uuid,
        spv,
        project,
        code,
        farm_type_id,
        farm_types (
          type_title
        ),
        farm_statuses (
          farm_status,
          tcma_status
        ),
        farm_locations (
          country,
          region,
          department,
          municipality
        ),
        farm_turbine_details (
          turbine_count,
          manufacturer,
          hub_height_m,
          rotor_diameter_m,
          rated_power_installed_mw,
          total_mmw
        )
      `)
      .eq('uuid', uuid)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return c.json({ error: 'Farm not found' }, 404)
      }
      return c.json({ error: 'Failed to fetch farm', details: error.message }, 500)
    }

    return c.json(data)

  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'Unknown error' }, 500)
  }
})

// GET /farms/:uuid/summary - Aggregated farm data (B2: C8, C10)
farms.get('/:uuid/summary', async (c) => {
  const uuid = c.req.param('uuid')

  try {
    const supabase = getSupabaseClient(c.env)

    // Fetch farm with all related data for aggregation
    const { data: farm, error: farmError } = await supabase
      .from('farms')
      .select(`
        uuid, spv, project, code, farm_type_id,
        farm_types(type_title),
        farm_statuses(farm_status, tcma_status),
        farm_locations(country, region, department),
        farm_turbine_details(turbine_count, total_mmw, manufacturer),
        farm_administrations(windmanager_subsidiary),
        substations(uuid, substation_name)
      `)
      .eq('uuid', uuid)
      .single()

    if (farmError) {
      if (farmError.code === 'PGRST116') {
        return c.json({ error: 'Farm not found' }, 404)
      }
      return c.json({ error: 'Failed to fetch farm', details: farmError.message }, 500)
    }

    // Count WTGs
    const { count: wtgCount } = await supabase
      .from('wind_turbine_generators')
      .select('*', { count: 'exact', head: true })
      .eq('farm_uuid', uuid)

    // Get performance data
    const { data: performances } = await supabase
      .from('farm_actual_performances')
      .select('year, amount')
      .eq('farm_uuid', uuid)
      .order('year', { ascending: false })
      .limit(5)

    // Build summary
    const farmData = farm as any
    const summary = {
      farm: {
        uuid: farmData.uuid,
        code: farmData.code,
        spv: farmData.spv,
        project: farmData.project,
        type: farmData.farm_types?.type_title || 'Unknown'
      },
      status: (farm as any).farm_statuses || null,
      location: (farm as any).farm_locations || null,
      technical: {
        turbineCount: (farm as any).farm_turbine_details?.turbine_count || 0,
        totalPowerMW: (farm as any).farm_turbine_details?.total_mmw || 0,
        manufacturer: (farm as any).farm_turbine_details?.manufacturer || null,
        substationCount: (farm as any).substations?.length || 0,
        wtgCount: wtgCount || 0
      },
      administration: {
        subsidiary: (farm as any).farm_administrations?.windmanager_subsidiary || null
      },
      recentPerformances: performances || []
    }

    return c.json(summary)

  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'Unknown error' }, 500)
  }
})

// POST /farms - Create new farm
farms.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const validation = validateFarmInput(body)

    if (!validation.valid) {
      return c.json({ error: 'Validation failed', details: validation.errors }, 400)
    }

    const supabase = getSupabaseClient(c.env)

    // Generate UUID
    const uuid = crypto.randomUUID()

    const { data, error } = await supabase
      .from('farms')
      .insert({
        uuid,
        ...validation.data
      } as any)
      .select()
      .single()

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        return c.json({ error: 'Farm with this code already exists' }, 409)
      }
      return c.json({ error: 'Failed to create farm', details: error.message }, 500)
    }

    return c.json(data, 201)

  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'Unknown error' }, 500)
  }
})

// PUT /farms/:uuid - Update existing farm
farms.put('/:uuid', async (c) => {
  const uuid = c.req.param('uuid')

  try {
    const body = await c.req.json()
    const validation = validateFarmInput(body)

    if (!validation.valid) {
      return c.json({ error: 'Validation failed', details: validation.errors }, 400)
    }

    const supabase = getSupabaseClient(c.env)

    // Check if farm exists
    const { data: existing, error: checkError } = await supabase
      .from('farms')
      .select('uuid')
      .eq('uuid', uuid)
      .single()

    if (checkError || !existing) {
      return c.json({ error: 'Farm not found' }, 404)
    }

    const { data, error } = await supabase
      .from('farms')
      .update(validation.data as any)
      .eq('uuid', uuid)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return c.json({ error: 'Farm with this code already exists' }, 409)
      }
      return c.json({ error: 'Failed to update farm', details: error.message }, 500)
    }

    return c.json(data)

  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'Unknown error' }, 500)
  }
})

// DELETE /farms/:uuid - Delete farm
farms.delete('/:uuid', async (c) => {
  const uuid = c.req.param('uuid')

  try {
    const supabase = getSupabaseClient(c.env)

    // Check if farm exists
    const { data: existing, error: checkError } = await supabase
      .from('farms')
      .select('uuid, code')
      .eq('uuid', uuid)
      .single()

    if (checkError || !existing) {
      return c.json({ error: 'Farm not found' }, 404)
    }

    // Cascading Delete: Delete related records in order of dependency
    // Note: In a production environment with many tables, ON DELETE CASCADE at the DB level is preferred.
    // For this implementation, we explicitly handle the main related tables.
    
    const relatedTables = [
      'farm_locations',
      'farm_statuses',
      'farm_turbine_details',
      'farm_administrations',
      'farm_actual_performances',
      'substations',
      'wind_turbine_generators'
    ]

    for (const table of relatedTables) {
      const foreignKey = table === 'substations' || table === 'wind_turbine_generators' || table === 'farm_actual_performances' 
        ? 'farm_uuid' 
        : 'uuid';
      
      await supabase.from(table).delete().eq(foreignKey, uuid);
    }

    // Finally delete the farm
    const { error } = await supabase
      .from('farms')
      .delete()
      .eq('uuid', uuid)

    if (error) {
      return c.json({ error: 'Failed to delete farm', details: error.message }, 500)
    }

    return c.json({ message: `Farm ${(existing as any).code} deleted successfully` })

  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : 'Unknown error' }, 500)
  }
})

export default farms
