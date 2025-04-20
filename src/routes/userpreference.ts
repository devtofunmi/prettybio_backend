// routes/preferences.ts
import { Hono } from 'hono';
import { getUserPreferences, updateUserPreferences } from '../controllers/userpreference.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

export const preferencesRoutes = new Hono();

// Use middleware for all routes in this group
preferencesRoutes.use('*', authMiddleware);

// GET /preferences
preferencesRoutes.get('/', getUserPreferences);

// PUT /preferences
preferencesRoutes.put('/', updateUserPreferences);


