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
exports.getElementsFromHistory = exports.deleteElementFromHistory = exports.insertIntoHistory = exports.updateHistoryElement = exports.cleanDublicateHistory = exports.updateHistory = void 0;
var index_js_1 = require("./index.js");
var scripts_js_1 = require("./scripts.js");
var updateHistory = function (userID, barcode, product) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, index_js_1.default.query("\n    SELECT COUNT (historyId) \n    FROM History\n    WHERE barcode = '".concat((0, scripts_js_1.checkInputBeforeSqlQuery)(barcode), "'\n        AND enduserId = '").concat((0, scripts_js_1.checkInputBeforeSqlQuery)(userID), "';"))];
            case 1:
                response = _a.sent();
                if (!(response.rows[0].count == 1)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, exports.updateHistoryElement)(userID, barcode, product)];
            case 2:
                _a.sent();
                return [3 /*break*/, 7];
            case 3:
                if (!(response.rows[0].count > 1)) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, exports.cleanDublicateHistory)(userID, barcode)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [4 /*yield*/, (0, exports.insertIntoHistory)(userID, barcode, product)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.updateHistory = updateHistory;
var cleanDublicateHistory = function (userID, barcode) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, index_js_1.default.query("\n    DELETE\n    FROM History\n    WHERE barcode = '".concat((0, scripts_js_1.checkInputBeforeSqlQuery)(barcode), "'\n        AND enduserId = '").concat((0, scripts_js_1.checkInputBeforeSqlQuery)(userID), "';"))];
            case 1:
                response = _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.cleanDublicateHistory = cleanDublicateHistory;
var updateHistoryElement = function (userID, barcode, product) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                product.name = (0, scripts_js_1.checkInputBeforeSqlQuery)(product.name);
                product.images = (0, scripts_js_1.checkInputBeforeSqlQuery)(product.images);
                return [4 /*yield*/, index_js_1.default.query("\n    UPDATE History\n    SET (lastused, productName, pictureLink)\n         = (current_timestamp, '".concat(product.name, "', '").concat(product.images, "')\n    WHERE barcode = '").concat((0, scripts_js_1.checkInputBeforeSqlQuery)(barcode), "'\n        AND enduserId = '").concat((0, scripts_js_1.checkInputBeforeSqlQuery)(userID), "';"))];
            case 1:
                response = _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.updateHistoryElement = updateHistoryElement;
var insertIntoHistory = function (userID, barcode, product) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userID = (0, scripts_js_1.checkInputBeforeSqlQuery)(userID);
                barcode = (0, scripts_js_1.checkInputBeforeSqlQuery)(barcode);
                product.name = (0, scripts_js_1.checkInputBeforeSqlQuery)(product.name);
                product.images = (0, scripts_js_1.checkInputBeforeSqlQuery)(product.images);
                return [4 /*yield*/, index_js_1.default.query("\n    INSERT INTO history (endUserID, barcode, productName, pictureLink) \n    VALUES ('".concat(userID, "', '").concat(barcode, "', '").concat(product.name, "', '").concat(product.images, "');"))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.insertIntoHistory = insertIntoHistory;
var deleteElementFromHistory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var elementID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                elementID = (0, scripts_js_1.checkInputBeforeSqlQuery)(req.params.elementID);
                return [4 /*yield*/, index_js_1.default.query("\n    DELETE FROM history \n    WHERE historyID = '".concat(elementID, "';"))];
            case 1:
                _a.sent();
                res.send("DELETED");
                return [2 /*return*/];
        }
    });
}); };
exports.deleteElementFromHistory = deleteElementFromHistory;
var getElementsFromHistory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userID, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userID = (0, scripts_js_1.checkInputBeforeSqlQuery)(req.user.userid);
                return [4 /*yield*/, index_js_1.default.query("\n    SELECT H.historyID, H.barcode, H.productName, H.lastUsed, H.pictureLink\n    FROM History H\n    JOIN EndUser EU ON EU.endUserID = H.endUserID\n    WHERE EU.endUserID = '".concat(userID, "'\n    ORDER BY H.lastused DESC;"))];
            case 1:
                response = _a.sent();
                res.send({ elements: response.rows });
                return [2 /*return*/];
        }
    });
}); };
exports.getElementsFromHistory = getElementsFromHistory;
