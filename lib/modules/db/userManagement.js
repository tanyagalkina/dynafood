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
exports.getToken = exports.createUser = exports.deleteUser = exports.getUser = void 0;
var index_js_1 = require("./index.js");
var scripts_js_1 = require("./scripts.js");
var jsonwebtoken_1 = require("jsonwebtoken");
var bcrypt_1 = require("bcrypt");
var parseGetUserResponse = function (rows) {
    var userObj = {
        firstName: rows[0].firstname,
        lastName: rows[0].lastname,
        userName: rows[0].username,
        email: rows[0].email,
        phoneNumber: rows[0].phonenumber,
        restrictons: []
    };
    for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
        var row = rows_1[_i];
        if (row.restrictionName != null)
            userObj.restrictons.push({
                alertActivation: row.alertactivation,
                restrictionName: row.restrictionname
            });
    }
    return userObj;
};
var getUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, index_js_1.db_adm_conn.query("\n        SELECT EU.firstName, EU.lastName, EU.userName, EU.email, EU.phoneNumber, ER.alertActivation, R.restrictionName\n        FROM EndUser EU\n        LEFT JOIN EndUser_Restriction ER ON ER.endUserID = EU.endUserID\n        LEFT JOIN Restriction R ON R.restrictionID = ER.restrictionID\n        WHERE EU.endUserID = '".concat((0, scripts_js_1.checkInputBeforeSqlQuery)(req.user.userid), "';"))];
            case 1:
                newUser = _a.sent();
                if (newUser.rows.length == 0) {
                    res.status(404).send("There is no EndUser with this id.");
                    return [2 /*return*/];
                }
                res.send(parseGetUserResponse(newUser.rows));
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1.stack);
                res.status(500).send({ "Error": err_1, "Details": err_1.stack });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, index_js_1.db_adm_conn.query("\n        DELETE FROM EndUser\n        WHERE endUserID = '".concat((0, scripts_js_1.checkInputBeforeSqlQuery)(req.user.userid), "' RETURNING *;"))];
            case 1:
                response = _a.sent();
                res.send({ "Deleted": response.rows });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log(err_2.stack);
                res.status(500).send({ "Error": err_2, "Details": err_2.stack });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var passcode, user, userid, token, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, bcrypt_1.default.hash(req.body.password, 10)];
            case 1:
                passcode = _a.sent();
                return [4 /*yield*/, index_js_1.db_adm_conn.query("\n        INSERT INTO EndUser (firstName, lastName, userName, email, phoneNumber, passcode, emailConfirmed)\n        VALUES \n            (\n                '".concat((0, scripts_js_1.checkInputBeforeSqlQuery)(req.body.firstName), "',\n                '").concat((0, scripts_js_1.checkInputBeforeSqlQuery)(req.body.lastName), "',\n                '").concat((0, scripts_js_1.checkInputBeforeSqlQuery)(req.body.userName), "',\n                '").concat((0, scripts_js_1.checkInputBeforeSqlQuery)(req.body.email), "',\n                '").concat((0, scripts_js_1.checkInputBeforeSqlQuery)(req.body.phoneNumber), "', \n                '").concat((0, scripts_js_1.checkInputBeforeSqlQuery)(passcode), "',\n                true\n            ) RETURNING *;"))];
            case 2:
                user = _a.sent();
                userid = user.rows[0].enduserid;
                token = jsonwebtoken_1.default.sign({ userid: userid }, process.env.JWT_SECRET, { expiresIn: "1h" });
                res.cookie("token", token, {
                    httpOnly: true,
                });
                res.status(200).send(token);
                return [2 /*return*/];
            case 3:
                error_1 = _a.sent();
                res.status(400).send({ "Error": "Unable to create new User.", "Details": "".concat(error_1.stack) });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createUser = createUser;
var getToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, user, correctPassword, userid, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.query.email;
                password = req.query.password;
                return [4 /*yield*/, index_js_1.db_adm_conn.query("\n        SELECT *\n        FROM EndUser\n        WHERE email = '".concat(email, "';\n    "))];
            case 1:
                user = _a.sent();
                if (user.rows.length == 0) {
                    console.log("There is no user with the email: ".concat(email));
                    res.status(404).send({ "Error": "There is no user with the email ".concat(email) });
                    return [2 /*return*/];
                }
                if (user.rowCount == 0) {
                    res.status(404).send({ "Error": "User has no rows" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.rows[0].passcode)];
            case 2:
                correctPassword = _a.sent();
                if (user.rows[0].email == email && correctPassword) {
                    userid = user.rows[0].enduserid;
                    token = jsonwebtoken_1.default.sign({ userid: userid }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    res.cookie("token", token, {
                        httpOnly: true,
                    });
                    res.status(200).send(token);
                    return [2 /*return*/];
                }
                res.status(401).send({ "Error": "Wrong credentials" });
                return [2 /*return*/];
        }
    });
}); };
exports.getToken = getToken;
