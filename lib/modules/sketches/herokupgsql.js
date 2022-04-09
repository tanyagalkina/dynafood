"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPool2 = void 0;
var pg_1 = require("pg");
//import { DB_STRING } from '../../config/index.js';
var Pool = pg_1.default.Pool;
var index_js_1 = require("../../config/index.js");
var isProduction = process.env.NODE_ENV === "production";
//THIS URI IS NOT STATIC !!! NOT IN USE
var db_uri = "postgres://enpwwhercphrri:6b23f247ecde2bf94b70d9be61d3e5fa037cc0bc3f360a6626933d955a48a608@ec2-52-208-185-143.eu-west-1.compute.amazonaws.com:5432/dfeof044pkurt3";
var connectionString = "postgresql://".concat(process.env.PG_USER, ":").concat(process.env.PG_PASSWORD, "@").concat(process.env.PG_HOST, ":").concat(process.env.PG_PORT, "/").concat(process.env.PG_DATABASE);
var dbPool2 = function (req, res) {
    console.log(process.env.NODE_ENV, index_js_1.PG_USER, index_js_1.PG_PASSWORD, index_js_1.PG_HOST, index_js_1.PG_PORT, index_js_1.PG_DATABASE, index_js_1.DATABASE_URL);
    var pool;
    if (process.env.NODE_ENV == 'production') {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            ssl: {
                rejectUnauthorized: false,
            },
        });
    }
    else {
        pool = new Pool({
            connectionString: connectionString,
            //connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000
        });
    }
    pool.connect(function (err, client, release) {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query('SELECT NOW()', function (err, result) {
            release();
            if (err) {
                return console.error('Error executing query', err.stack);
            }
            console.log(result.rows);
            res.status(200).send(result.rows);
        });
    });
};
exports.dbPool2 = dbPool2;
// const connectionString =  'postgres://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + DB_STRING
// export const poolExample = () => {
//     console.log('[EXAMPLE] I am DB Pool example func')
//     const pool = new Pool({
//         connectionString,
//         max: 20,
//         idleTimeoutMillis: 30000,
//         connectionTimeoutMillis: 2000,
//     })
//     pool.connect((err, client, release) => {
//         if (err) {
//             return console.error('Error acquiring client', err.stack)
//         }
//         client.query('SELECT NOW()', (err, result) => {
//             release()
//             if (err) {
//             return console.error('Error executing query', err.stack)
//             }
//         console.log(result.rows)
//         })
//     })    
// }
