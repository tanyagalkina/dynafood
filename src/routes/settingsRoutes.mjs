import { Router } from 'express'
const router = Router();
import { urlencoded } from 'express';

import { secureRouteMiddleware } from '../middleware/security/secureRouting.js'
import { getSettings, postSettings, patchSettings, deleteSettings } from '../modules/db/settingsManagement.js';
import { getRestrictionIdByName, hasRestriction } from '../middleware/settings.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Settings:
 *       type: object
 *       properties:
 *         restrictionName:
 *           type: string
 *           description: Name of the restriction.
 *         alertActivation:
 *           type: bool
 *           description: Idicates if the alerts should be activated for this restriction.
 *     Error:
 *       type: object
 *       properties:
 *         Error:
 *           type: string
 *           description: The error string.
 *         Details:
 *           type: string
 *           description: Details of the occurred error.
*/

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Returns the settings for this users.
 *     parameters:
 *       - in: cookie
 *         name: token
 *         schema:
 *           type: JWT
 *         required: true
 *         description: JWT user got on login.
 *     responses:
 *       200:
 *         description: The list of restrictions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Settings'
 *       204:
 *         description: The user has no restrictions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Error'
*/
router.get('/settings', secureRouteMiddleware, getSettings);

/*
 * @swagger
 * /settings:
 *   post:
 *     summary: Adds new settings to the user
 *     parameters:
 *       - in: cookie
 *         name: token
 *         schema:
 *           type: JWT
 *         required: true
 *         description: JWT user got on login.
 *       - in: body
 *         schema:
 *            type: object
 *            items:
 *              $ref: '#/components/schemas/Settings'
 *     responses:
 *       200:
 *         description: The list of restrictions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Settings'
 *       204:
 *         description: The user has no restrictions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Error'
*/
router.post('/settings', secureRouteMiddleware, getRestrictionIdByName, postSettings);
router.patch('/settings', secureRouteMiddleware, getRestrictionIdByName, hasRestriction, patchSettings);
router.delete('/settings', secureRouteMiddleware, getRestrictionIdByName, deleteSettings);


export default router;
