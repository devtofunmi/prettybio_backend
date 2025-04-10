import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from './routes/auth.js'
import { accountRoutes } from './routes/account.js'
import linkRoutes from './routes/links.js'
import socialRoutes from './routes/sociallinks.js'
import { publicRoutes as linkPublicRoutes } from './routes/links.js'; 
import { publicRoutes as socialPublicRoutes } from './routes/sociallinks.js'; 
import { analyticsRoutes } from './routes/analytics.js'
import { preferencesRoutes } from './routes/userpreference.js' 

const app = new Hono()

// Enable CORS for all routes
app.use(cors({ 
  origin: '*' 
}));

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
app.route('/public/links', linkPublicRoutes);
app.route('/public/sociallinks', socialPublicRoutes);


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
