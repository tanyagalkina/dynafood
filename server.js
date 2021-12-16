import Express from 'express'
import http from 'http'
import path from 'path'
import logger from './src/middleware/logger.js'

import morgan from 'morgan'
import swaggerUI from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

import mainRouter from './src/routes/index.mjs'; //DIR_IMPORT NOT SUPPORTED
import historyRouter from './src/routes/historyRoutes.mjs'; //DIR_IMPORT NOT SUPPORTED
import productRouter from './src/routes/productRoutes.mjs'; //DIR_IMPORT NOT SUPPORTED
import settingRouter from './src/routes/settingsRoutes.mjs'; //DIR_IMPORT NOT SUPPORTED
import userRouter from './src/routes/userRoutes.mjs'; //DIR_IMPORT NOT SUPPORTED
import { HOST, PORT, DB_STRING} from './src/config/index.js';
export const app = new Express(); 
const server = new http.Server(app);
import cookieParser from 'cookie-parser';
// import jwt from 'express-jwt';
import cors from 'cors'; //dont know what is it for
import { poolExample } from './src/modules/db/index.js'
import { dbPool2} from './src/modules/sketches/herokupgsql.js'

const options = {
    apis: ["./src/routes/*.mjs"],
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Dynafood API",
            version: "1.0.0",
            description: "Api to get Food-information"
        },
        servers: [
            {
                url: "http://localhost:8081"
            }
        ]
    }
}

const specs = swaggerJSDoc(options)

const STRING = "HELLO STRING";

app.use(cors());
app.use(Express.json({ limit: '200kb' }));
app.use(Express.urlencoded({extended: true }));
app.use(cookieParser());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

app.use(mainRouter);
app.use(userRouter);
app.use(settingRouter);
app.use(historyRouter);
app.use(productRouter);

app.use(logger);

server.listen(PORT, () =>

console.log(`[LOGGER] The server is listening on port ${PORT} and nb ${STRING}`))