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
exports.getProduct = exports.checkAlertVegetarian = void 0;
var axios_1 = require("axios");
var historyManagement_js_1 = require("./db/historyManagement.js");
var index_js_1 = require("./db/index.js");
var scripts_js_1 = require("./db/scripts.js");
var getInnerIngredients = function (ingredient) {
    var inner = [];
    var vegan = true;
    var vegetarian = true;
    if (typeof ingredient.ingredients != "undefined" && ingredient.ingredients != null) {
        for (var i = 0; i < ingredient.ingredients.length; i++) {
            var tmp = {
                name: ingredient.ingredients[i].text.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, function (match) { return match.toUpperCase(); }),
                vegan: ingredient.ingredients[i].vegan,
                vegetarian: ingredient.ingredients[i].vegetarian,
                ingredients: getInnerIngredients(ingredient.ingredients[i])
            };
            console.log(tmp.name);
            if (tmp.vegan) {
                vegan = true;
            }
            if (tmp.vegetarian) {
                vegetarian = true;
            }
            inner.push(tmp);
        }
        return ({ vegan: vegan, vegetarian: vegetarian, ingredients: inner });
    }
    return { vegan: null, vegetarian: null, ingredients: [] };
};
var getAllAllergenes = function (hierarchy) {
    var allergenes = [];
    if (typeof hierarchy != "undefined" && hierarchy != null) {
        hierarchy.forEach(function (entry) {
            allergenes.push(entry.substring(entry.indexOf(":") + 1));
        });
    }
    return allergenes;
};
var getNutriments = function (nutriments) {
    if (typeof nutriments != "undefined" && nutriments != null) {
        return {
            calcium: nutriments.calcium_100g,
            carbohydrates: nutriments.carbohydrates_100g,
            cholesterol: nutriments.cholesterol_100g,
            kcal: nutriments.energy_100g,
            fat: nutriments.fat_100g,
            fiber: nutriments.fiber_100g,
            iron: nutriments.iron_100g,
            proteins: nutriments.proteins_100g,
            salt: nutriments.salt_100g,
            'saturated fat': nutriments['saturated-fat_100g'],
            sodium: nutriments.sodium_100g,
            sugars: nutriments.sugars_100g,
            'trans fat': nutriments['trans-fat_100g'],
            'vitamin A': nutriments['vitamin-a_100g'],
            'vitamin B': nutriments['vitamin-b_100g'],
            'vitamin C': nutriments['vitamin-c_100g'],
            'vitamin D': nutriments['vitamin-d_100g'],
            'vitamin E': nutriments['vitamin-e_100g']
        };
    }
    return null;
};
var getNutrimentsScore = function (data) {
    var ret = {
        energy_points: null,
        fiber_points: null,
        negative_points: null,
        positive_points: null,
        proteins_points: null,
        saturated_fat_points: null,
        sodium_points: null,
        sugars_points: null,
        total_grade: null,
        total_score: null,
    };
    if (typeof data.nutriscore_data != "undefined" && data.nutriscore_data != null) {
        ret.energy_points = data.nutriscore_data.energy_points;
        ret.fiber_points = data.nutriscore_data.fiber_points;
        ret.negative_points = data.nutriscore_data.negative_points;
        ret.positive_points = data.nutriscore_data.positive_points;
        ret.proteins_points = data.nutriscore_data.proteins_points;
        ret.saturated_fat_points = data.nutriscore_data.saturated_fat_points;
        ret.sodium_points = data.nutriscore_data.sodium_points;
        ret.sugars_points = data.nutriscore_data.sugars_points;
    }
    ret.total_grade = data.nutriscore_grade;
    ret.total_score = ret.positive_points - ret.negative_points;
    return ret;
};
var getEcoScore = function (data) {
    var ret = {
        eco_grade: null,
        eco_score: null,
        epi_score: null,
        transportation_scores: null,
        packaging: null,
        agribalyse: null, // Co2 emission from different parts
    };
    if (typeof data.ecoscore_data != "undefined" && data.ecoscore_data != null && data.ecoscore_grade !== "not-applicable") {
        ret.eco_score = data.ecoscore_score;
        ret.epi_score = data.ecoscore_data.adjustments.origins_of_ingredients.epi_score;
        ret.transportation_scores = data.ecoscore_data.adjustments.origins_of_ingredients.transportation_scores;
        ret.packaging = data.ecoscore_data.adjustments.packaging;
        ret.agribalyse = data.ecoscore_data.agribalyse;
    }
    ret.eco_grade = data.ecoscore_grade;
    return ret;
};
var checkAlertVegetarian = function (userid, product) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!product.ingredients.vegetarian) return [3 /*break*/, 2];
                return [4 /*yield*/, index_js_1.db_adm_conn.query("\n        SELECT R.restrictionName, ER.alertActivation \n        FROM Restriction R\n        LEFT JOIN EndUser_Restriction ER ON ER.restrictionID = R.restrictionID\n        WHERE ER.endUserID = '".concat((0, scripts_js_1.checkInputBeforeSqlQuery)(userid), "'\n            AND R.restrivtionName = 'vegetarian';"))];
            case 1:
                response = _a.sent();
                if (response.rows.length > 0 && response.rows[0].alertActivation) {
                    return [2 /*return*/, true];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, false];
        }
    });
}); };
exports.checkAlertVegetarian = checkAlertVegetarian;
var getProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userID, response, url, product, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userID = req.user.userid //here insert checking for existing acces_token in EndUser and find user
                ;
                response = {
                    name: null,
                    keywords: [],
                    allergens: [],
                    categories: [],
                    qualities: [],
                    warings: [],
                    ecoscoreData: null,
                    packing: [],
                    images: [],
                    ingredients: [],
                    nutriments_g_pro_100g: [],
                    nutriments_scores: [],
                    vegetarian_alert: false
                };
                url = "https://world.openfoodfacts.org/api/2/product/".concat(req.params.barcode, ".json");
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                product = _a.sent();
                if (typeof product === "undefined" || product == null) {
                    res.status(500).send({ error: "undefined response from OpenFoodFacts Api" });
                }
                if (product.data.status != 1) {
                    res.status(204).send({ response: "Product not found" });
                    return [2 /*return*/];
                }
                if (typeof product === "object" && product.data && product.data.product) {
                    data = product["data"]["product"];
                    response.keywords = data["_keywords"];
                    response.allergens = getAllAllergenes(data["allergens_hierarchy"]);
                    response.categories = data["categories"] ? data["categories"].split(',') : [];
                    response.qualities = data["data_quality_tags"];
                    response.warings = data["data_quality_warnings_tags"];
                    response.ecoscoreData = getEcoScore(data);
                    response.packing = data["packaging"];
                    response.name = product.data.product.product_name;
                    if (typeof data["image_front_url"] === "undefined" || data["image_front_url"] == null)
                        response.images = null;
                    else
                        response.images = data["image_small_url"];
                    if (product.data.product) {
                        response.ingredients = getInnerIngredients(product.data.product);
                    }
                    if (product.data.product && product.data.product.nutriments) {
                        response.nutriments_g_pro_100g = getNutriments(product.data.product.nutriments);
                    }
                    (0, historyManagement_js_1.updateHistory)(userID, req.params.barcode, response);
                    response.nutriments_scores = getNutrimentsScore(product.data.product);
                    // response.vegetarian_alert = await checkAlertVegetarian(userID, response)
                }
                res.status(200).send(response);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500).send("Internal Server Error");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProduct = getProduct;
