"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_URL = exports.NODE_ENV = exports.PG_DATABASE = exports.PG_PORT = exports.PG_HOST = exports.PG_PASSWORD = exports.PG_USER = exports.PORT = exports.HOST = void 0;
var env = process.env;
exports.HOST = env.HOST;
exports.PORT = Number(env.PORT) || 8081;
// export const DB_STRING=env.DB_STRING || '@localhost:5432/postgres'
exports.PG_USER = process.env.PG_USER || 'postgres';
exports.PG_PASSWORD = 'password';
exports.PG_HOST = process.env.DB_HOST || 'localhost';
exports.PG_PORT = Number(env.PG_PORT) || Number(5432);
exports.PG_DATABASE = process.env.PG_DATABASE || 'dynaFood';
exports.NODE_ENV = env.NODE_ENV;
exports.DATABASE_URL = 'hahaha';
