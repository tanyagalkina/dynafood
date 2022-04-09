"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInputBeforeSqlQuery = void 0;
var checkInputBeforeSqlQuery = function (arg) {
    if (!arg)
        return;
    arg = arg.replace("'", "''");
    return arg;
};
exports.checkInputBeforeSqlQuery = checkInputBeforeSqlQuery;
