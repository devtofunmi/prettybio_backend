// routes/preferences.ts
import { Hono } from 'hono'
import { getUserPreferences, updateUserPreferences } from '../controllers/userpreference.js' // adjust path if needed

export const preferencesRoutes = new Hono()

// GET /preferences/:userId
preferencesRoutes.get('/:userId', async (c) => {
  const userId = c.req.param('userId')
  try {
    const prefs = await getUserPreferences(userId)
    return c.json(prefs)
  } catch (error) {
    return c.json({ error: (error instanceof Error ? error.message : 'Unknown error') }, 500)
  }
})

// PUT /preferences/:userId
preferencesRoutes.put('/:userId', async (c) => {
  const userId = c.req.param('userId')
  const body = await c.req.json()
  const { theme, socialPosition } = body

  if (!theme || !socialPosition) {
    return c.json({ error: 'theme and socialPosition are required' }, 400)
  }

  try {
    const updated = await updateUserPreferences(userId, theme, socialPosition)
    return c.json(updated)
  } catch (error) {
    return c.json({ error: (error instanceof Error ? error.message : 'Unknown error') }, 500)
  }
})

