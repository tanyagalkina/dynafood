"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
var express_2 = require("express");
var express_3 = require("express");
var cookie_parser_1 = require("cookie-parser");
//import { getEcho, getUsers } from '../modules/db/index.js'
var index_js_1 = require("../modules/db/index.js");
var logger_js_1 = require("../middleware/logger.js");
var herokupgsql_js_1 = require("../modules/sketches/herokupgsql.js");
router.use((0, express_3.json)({ limit: '200kb' }));
router.use((0, express_2.urlencoded)({ extended: true }));
router.use((0, cookie_parser_1.default)());
router.use(logger_js_1.default);
router.get('/welcome', function (req, res) {
    res.status(200).send("Welcome 🙌 ");
});
//DB TEST FUNCS
router.get('/pg', herokupgsql_js_1.dbPool2);
router.get('/pgtables', index_js_1.showTables);
router.get('/time', index_js_1.poolExample);
router.get('/echo', index_js_1.getEcho);
router.get('/users', index_js_1.getUsers); //should delete later
exports.default = router;
