import { Router } from 'express'
const router = Router();
import { urlencoded } from 'express';
import { json } from 'express';
import jwt from 'express-jwt';
import cookieParser from 'cookie-parser';
import { getProduct } from '../modules/barcode_scanner.js'
import {getEcho, getUsers, getUser, deleteUser, postUser} from '../modules/db/index.js'
import logger from '../middleware/logger.js'

// import {
//     login
//     ,logout
//     ,users
//     ,isUserLoggedIn
// } from './login.js';

router.use(json({limit: '200kb'}));
router.use(urlencoded({extended: true}));
router.use(cookieParser());
router.use(logger);

router.get('/welcome', (req, res) => {

    res.status(200).send("Welcome 🙌 ");

})

router.get('/products/barcode/:barcode', getProduct)
router.get('/echo', getEcho)
router.get('/users', getUsers)
router.get('/user', getUser)
router.post('/user', postUser)
router.delete('/user', deleteUser)
// router.post('/api/login', login);
// router.post('/api/sign', signup);
// router.post('/api/isLoggedIn', isUserLoggedIn);
// router.get('/about.json', about);
// router.get('/api/permissions', getPerms);
// router.post('/api/logout', logout)
// router.post('/api/delete/account', deleteAccount)

export default router;
