"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getEcho = exports.whatTimePGQL = exports.showTables = exports.db_adm_conn = exports.poolExample = void 0;
var pg_1 = require("pg");
var Client = pg_1.default.Client;
var Pool = pg_1.default.Pool;
console.log('this is db_vars:', process.env.DB_USER, process.env.DB_PORT, process.env.DB_HOST, process.env.DB_DATABASE);
//const connectionString =  'postgres://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + DB_STRING
var connectionString = "postgresql://".concat(process.env.PG_USER, ":").concat(process.env.PG_PASSWORD, "@").concat(process.env.PG_HOST, ":").concat(process.env.PG_PORT, "/").concat(process.env.PG_DATABASE);
//const connectionString =  process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}${DB_STRING}`
var poolExample = function (req, res) {
    console.log('[EXAMPLE] I am DB Pool example func');
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
    else
        pool = new Pool({
            connectionString: connectionString,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
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
exports.poolExample = poolExample;
if (process.env.NODE_ENV !== 'production') {
    exports.db_adm_conn = new Client({
        connectionString: connectionString,
    });
}
else {
    exports.db_adm_conn = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
}
exports.db_adm_conn.connect();
var showTables = function (req, res) {
    exports.db_adm_conn.query('SELECT table_schema,table_name FROM information_schema.tables;', function (err, res) {
        if (err)
            throw err;
        for (var _i = 0, _a = res.rows; _i < _a.length; _i++) {
            var row = _a[_i];
            console.log(JSON.stringify(row));
        }
    });
    res.status(200).json({ "msg": "showtables function" });
};
exports.showTables = showTables;
var whatTimePGQL = function (res, req) {
    exports.db_adm_conn.query('SELECT NOW()', function (err, result) {
        if (err) {
            res.status(500).json(err.stack);
            return console.error('Error executing query', err.stack);
        }
        console.log(result.rows);
        res.status(200).send(result.rows);
    });
};
exports.whatTimePGQL = whatTimePGQL;
var getEcho = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send(JSON.stringify(req.query));
        return [2 /*return*/];
    });
}); };
exports.getEcho = getEcho;
var getUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log('[LOGGER], getUsers func');
                _b = (_a = res).send;
                return [4 /*yield*/, exports.db_adm_conn.query("SELECT * FROM EndUser")];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); };
exports.getUsers = getUsers;
exports.default = exports.db_adm_conn;
// export const poolExample = () => {
//     console.log('[EXAMPLE] I am DB Pool example func')
//     const pool = new Pool({
//         connectionString: connectionString,
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
// export function connect() {
//     let db_adm_conn = new Client({
//         connectionString : connectionString
//     });
//     db_adm_conn.on('error', error => {
//         connect();
//     });
//     db_adm_conn.connect().catch(() => { connect() });
//     return db_adm_conn
// }
// export let db_adm_conn = connect()
