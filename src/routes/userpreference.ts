import { Hono } from 'hono';
import { getUserPreferences, updateUserPreferences } from '../controllers/userpreference.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

export const preferencesRoutes = new Hono();

preferencesRoutes.use('*', authMiddleware);

preferencesRoutes.get('/:userId', getUserPreferences);

preferencesRoutes.put('/:userId', updateUserPreferences);



