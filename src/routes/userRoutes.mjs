import { Router } from 'express'
const router = Router();
import { urlencoded } from 'express';

import { getUser, deleteUser, createUser, getToken } from '../modules/db/userManagement.js'
import { checkUserIdReq, checkCreateUserReq } from '../middleware/security/user.js'
import { secureRouteMiddleware } from '../middleware/security/secureRouting.js'

router.get('/user', secureRouteMiddleware, checkUserIdReq, getUser)
router.post('/user', checkCreateUserReq, createUser)
router.post('/signup', checkCreateUserReq, createUser)
router.delete('/user', secureRouteMiddleware, checkUserIdReq, deleteUser)

router.get('/token', getToken);
router.get('/login', getToken);

export default router;
