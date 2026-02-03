import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Enable CORS for frontend
app.use('/*', cors())

// Hello World endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Hello World',
    api: 'WNDMNGR Backend API',
    version: '1.0.0'
  })
})

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

export default app
