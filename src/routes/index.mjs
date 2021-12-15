import { Router } from 'express'
const router = Router();
import { urlencoded } from 'express';
import { json } from 'express';
import jwt from 'express-jwt';
import cookieParser from 'cookie-parser';
import { getProduct } from '../modules/barcode_scanner.js'
import {
 getEcho
,getUsers
,getUser
,deleteUser
,postUser
,whatTimePGQL
,poolExample
,showTables } from '../modules/db/index.js'
import logger from '../middleware/logger.js'
import { dbPool2 } from '../modules/sketches/herokupgsql.js'

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
router.get('/users', getUsers)
router.get('/user', getUser)
router.post('/user', postUser)
router.delete('/user', deleteUser)

export default router;
