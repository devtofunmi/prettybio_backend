import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import authRoutes from './routes/auth.js'
import { accountRoutes } from './routes/account.js'
import linkRoutes from './routes/links.js'
import socialRoutes from './routes/sociallinks.js'
import { publicRoutes as linkPublicRoutes } from './routes/links.js'; 
import { publicRoutes as socialPublicRoutes } from './routes/sociallinks.js'; 
import { analyticsRoutes } from './routes/analytics.js'
import { preferencesRoutes } from './routes/userpreference.js' 

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
app.route("/auth", authRoutes);
app.route("/account", accountRoutes);
app.route("/links", linkRoutes);
app.route("/sociallinks", socialRoutes);
app.route('/analytics', analyticsRoutes);
app.route('/preferences', preferencesRoutes)



// Public click tracking routes (no auth)
app.route('/public', linkPublicRoutes);
app.route('/public', socialPublicRoutes);


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
