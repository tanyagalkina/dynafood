"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
var secureRouting_js_1 = require("../middleware/security/secureRouting.js");
var settingsManagement_js_1 = require("../modules/db/settingsManagement.js");
var settings_js_1 = require("../middleware/settings.js");
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
 *           type: boolean
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
router.get('/settings', secureRouting_js_1.secureRouteMiddleware, settingsManagement_js_1.getSettings);
/**
 * @swagger
 * /settings:
 *   post:
 *     summary: Adds new settings to the user.
 *     parameters:
 *       - in: cookie
 *         name: token
 *         schema:
 *           type: JWT
 *         required: true
 *         description: JWT user got on login.
 *       - in: body
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Settings'
 *         required: true
 *     responses:
 *       200:
 *         description: No errors.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Error'
*/
router.post('/settings', secureRouting_js_1.secureRouteMiddleware, settings_js_1.getRestrictionIdByName, settingsManagement_js_1.postSettings);
/**
 * @swagger
 * /settings:
 *   patch:
 *     summary: Modifies the settings of the user.
 *     parameters:
 *       - in: cookie
 *         name: token
 *         schema:
 *           type: JWT
 *         required: true
 *         description: JWT user got on login.
 *       - in: body
 *         schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Settings'
 *         required: true
 *     responses:
 *       200:
 *         description: No errors.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Error'
*/
router.patch('/settings', secureRouting_js_1.secureRouteMiddleware, settings_js_1.getRestrictionIdByName, settings_js_1.hasRestriction, settingsManagement_js_1.patchSettings);
/**
 * @swagger
 * /settings:
 *   delete:
 *     summary: Deletes the given setting of the user.
 *     parameters:
 *       - in: cookie
 *         name: token
 *         schema:
 *           type: JWT
 *         required: true
 *         description: JWT user got on login.
 *       - in: body
 *         name: restrictionName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the restriction you want to delete.
 *     responses:
 *       200:
 *         description: No errors
 *       400:
 *         description: Bad request, if the user does not have a restriction set for the given restriction.
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
router.delete('/settings', secureRouting_js_1.secureRouteMiddleware, settings_js_1.getRestrictionIdByName, settingsManagement_js_1.deleteSettings);
exports.default = router;
