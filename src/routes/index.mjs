import { Router } from 'express'
const router = Router();
import { urlencoded } from 'express';
import { json } from 'express';
import cookieParser from 'cookie-parser';
import { getProduct } from '../modules/barcode_scanner.js'
import { getUser, deleteUser, createUser, getToken } from '../modules/db/userManagement.js'
import { getSettings, postSettings, patchSettings, deleteSettings } from '../modules/db/settingsManagement.js';
//import { getEcho, getUsers } from '../modules/db/index.js'
import {
    getEcho
   ,getUsers
   ,whatTimePGQL
   ,poolExample
   ,showTables } from '../modules/db/index.js'
import logger from '../middleware/logger.js'
import { checkDeleteElementReq, checkGetElementsFromHistoryReq } from '../middleware/security/history.js'
import { checkUserIdReq, checkCreateUserReq } from '../middleware/security/user.js'
import { getElementsFromHistory, deleteElementFromHistory } from '../modules/db/historyManagement.js'
import { dbPool2 } from '../modules/sketches/herokupgsql.js'
import { secureRouteMiddleware } from '../middleware/security/secureRouting.js'
import { getRestrictionIdByName, hasRestriction } from '../middleware/settings.js'

router.use(json({limit: '200kb'}));
router.use(urlencoded({extended: true}));
router.use(cookieParser());
router.use(logger);

router.get('/welcome', (req, res) => {

    res.status(200).send("Welcome 🙌 ");

})

//DB TEST FUNCS
router.get('/pg', dbPool2)
router.get('/pgtables', showTables)
router.get('/time', poolExample)

//

router.get('/products/barcode/:barcode', getProduct)

router.get('/echo', getEcho)
router.get('/users', getUsers) //should delete later


router.get('/user', secureRouteMiddleware, checkUserIdReq, getUser)
router.post('/user', checkCreateUserReq, createUser)
router.post('/signup', checkCreateUserReq, createUser)
router.delete('/user', secureRouteMiddleware, checkUserIdReq, deleteUser)

router.get('/token', getToken);
router.get('/login', getToken);



/**
 * @swagger
 * components:
 *   schemas:
 *     Settings:
 *     type: object
 *     properties:
 *       restrictionName:
 *         type: string
 *         description: Name of the restriction.
 *       alertActivation:
 *         type: bool
 *         description: Idicates if the alerts should be activated for this restriction.
 *     Error:
 *     type: object
 *     properties:
 *       Error:
 *         type: string
 *         description: The error string.
 *       Details:
 *         type: string
 *         description: Details of the occurred error.
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

router.get('/history/', checkGetElementsFromHistoryReq, getElementsFromHistory)
router.delete('/history/:elementID', checkDeleteElementReq, deleteElementFromHistory)

export default router;
