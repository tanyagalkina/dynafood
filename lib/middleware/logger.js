"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger = function (req, res, next) {
    //console.log ("Hello, I am the logger");
    console.log("".concat(req.protocol, "://").concat(req.get('host')).concat(req.originalUrl));
    next();
};
exports.default = logger;
