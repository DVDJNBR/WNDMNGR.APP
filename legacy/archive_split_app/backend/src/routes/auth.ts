import { Hono } from 'hono'
import { Env, getAuthConfig, getEntraEndpoints } from '../config/auth'

const auth = new Hono<{ Bindings: Env }>()

// Generate random state for CSRF protection
function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// GET /auth/login - Initiate OAuth flow
auth.get('/login', (c) => {
  const config = getAuthConfig(c.env)
  const endpoints = getEntraEndpoints(config.tenantId)
  const state = generateState()

  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: 'code',
    redirect_uri: config.redirectUri,
    scope: config.scopes.join(' '),
    response_mode: 'query',
    state: state
  })

  const authUrl = `${endpoints.authorize}?${params.toString()}`

  // Redirect to Azure login page
  return c.redirect(authUrl)
})

// GET /auth/callback - Handle OAuth callback
auth.get('/callback', async (c) => {
  const code = c.req.query('code')
  const error = c.req.query('error')
  const errorDescription = c.req.query('error_description')

  if (error) {
    return c.json({
      error: 'Authentication failed',
      details: errorDescription || error
    }, 400)
  }

  if (!code) {
    return c.json({
      error: 'Missing authorization code'
    }, 400)
  }

  const config = getAuthConfig(c.env)
  const endpoints = getEntraEndpoints(config.tenantId)

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch(endpoints.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code',
        scope: config.scopes.join(' ')
      })
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      return c.json({
        error: 'Token exchange failed',
        details: errorData
      }, 400)
    }

    const tokens = await tokenResponse.json() as {
      access_token: string
      id_token: string
      token_type: string
      expires_in: number
      refresh_token?: string
    }

    // Redirect back to frontend with tokens
    // In production, use secure cookies or a safer transfer mechanism
    const frontendUrl = c.env.FRONTEND_URL || 'http://localhost:3000'
    const redirectUrl = new URL(`${frontendUrl}/auth/callback`)
    redirectUrl.searchParams.set('access_token', tokens.access_token)
    redirectUrl.searchParams.set('id_token', tokens.id_token)
    
    return c.redirect(redirectUrl.toString())

  } catch (err) {
    console.error('Token exchange error:', err)
    return c.json({
      error: 'Token exchange failed',
      message: err instanceof Error ? err.message : 'Unknown error'
    }, 500)
  }
})

// GET /auth/logout - Clear session (placeholder)
auth.get('/logout', (c) => {
  // In a real app, you would clear cookies/session here
  return c.json({
    message: 'Logged out successfully'
  })
})

export default auth
