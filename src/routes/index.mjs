import { Router } from 'express'
const router = Router();
import { urlencoded } from 'express';
import { json } from 'express';
import cookieParser from 'cookie-parser';
import { getProduct } from '../modules/barcode_scanner.js'
import { getUser, deleteUser, createUser, getToken } from '../modules/db/userManagement.js'
import { getSettings, postSettings, patchSettings } from '../modules/db/settingsManagement.js';
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
import { getRestrictionIdByName } from '../middleware/getRestrictionIdByName.js'

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

router.get('/settings', secureRouteMiddleware, getSettings);
router.post('/settings', secureRouteMiddleware, getRestrictionIdByName, postSettings);
router.patch('/settings', secureRouteMiddleware, getRestrictionIdByName, patchSettings);

router.get('/history/', checkGetElementsFromHistoryReq, getElementsFromHistory)
router.delete('/history/:elementID', checkDeleteElementReq, deleteElementFromHistory)

export default router;
