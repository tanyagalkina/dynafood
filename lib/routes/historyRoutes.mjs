"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = (0, express_1.Router)();
var history_js_1 = require("../middleware/security/history.js");
var historyManagement_js_1 = require("../modules/db/historyManagement.js");
var secureRouting_js_1 = require("../middleware/security/secureRouting.js");
/**
 * @swagger
 * components:
 *   schemas:
 *     History:
 *       type: object
 *       properties:
 *         historyID:
 *           type: string
 *           description: Unique identifier of the history element
 *         barcode:
 *           type: string
 *           description: barcode from product
 *         productName:
 *           type: string
 *           description: name of product
 *         lastUsed:
 *           type: string
 *           description: time and date the product was scanned
 *         pictureLink:
 *           type: string
 *           description: link to a picure of the product
 */
/**
 * @swagger
 * /history:
 *   get:
 *     summary: Returns the list of all history elements from the user doing the request
 *     parameters:
 *          - in: cookie
 *            name: token
 *            schema:
 *              type: JWT
 *            required: true
 *            description: JWT user got on login
 *     responses:
 *       200:
 *         description: The list of the history elements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/History'
 */
router.get('/history/', secureRouting_js_1.secureRouteMiddleware, history_js_1.checkGetElementsFromHistoryReq, historyManagement_js_1.getElementsFromHistory);
/**
 * @swagger
 * /history/{elementID}:
 *   delete:
 *     summary: Deletes a history element from the user doing the request
 *     parameters:
 *          - in: cookie
 *            name: token
 *            schema:
 *              type: JWT
 *            required: true
 *            description: JWT user got on login
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: id of history element to delete
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/history/:elementID', secureRouting_js_1.secureRouteMiddleware, history_js_1.checkDeleteElementReq, historyManagement_js_1.deleteElementFromHistory);
exports.default = router;
