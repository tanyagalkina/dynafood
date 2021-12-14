import Express from 'express'
import http from 'http'
import path from 'path'
import logger from './src/middleware/logger.js'

import router from './src/routes/index.mjs'; //DIR_IMPORT NOT SUPPORTED
import { HOST, PORT, DB_STRING} from './src/config/index.js';

export const app = new Express(); 
const server = new http.Server(app);
// import logger from './src/middleware/logger.js';
import cookieParser from 'cookie-parser';
// import jwt from 'express-jwt';
import cors from 'cors'; //dont know what is it for
import { poolExample } from './src/modules/db/index.js'

poolExample();

const STRING = "HELLO STRING";

app.use(cors());
app.use(Express.json({ limit: '200kb' }));
app.use(Express.urlencoded({extended: true }));
app.use(cookieParser());

app.use(router);

app.use(logger);

server.listen(PORT, () =>

console.log(`[LOGGER] The server is listening on port ${PORT} and nb ${STRING}`))