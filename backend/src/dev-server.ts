import { serve } from '@hono/node-server'
import app from './index.js'

const port = 8787

console.log(`Server running at http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
