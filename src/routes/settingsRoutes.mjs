import { Router } from 'express'
const router = Router();
import { urlencoded } from 'express';

import { getSettings, postSettings } from '../modules/db/settingsManagement.js';
import { secureRouteMiddleware } from '../middleware/security/secureRouting.js'

router.get('/settings', secureRouteMiddleware, getSettings);
router.post('/settings', secureRouteMiddleware, postSettings);

export default router;
