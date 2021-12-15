
import axios from 'axios';
import https from 'https';
import { insertIntoHistory } from './db/historyManagement.js'

const getInnerIngredients = (ingredient) => {
    let inner = []
    let vegan = true
    let vegetarian = true
    if (typeof ingredient.ingredients != "undefined" && ingredient.ingredients != null) {
        for (var i = 0; i  < ingredient.ingredients.length; i++) {
            var tmp = {
                name: ingredient.ingredients[i].text,
                vegan: ingredient.ingredients[i].vegan,
                vegetarian: ingredient.ingredients[i].vegetarian,
                ingredients : getInnerIngredients(ingredient.ingredients[i])
            }
            if (tmp.vegan) {
                vegan = true
            }
            if (tmp.vegetarian) {
                vegetarian = true
            }
            inner.push(tmp)
        }
        return ({vegan: vegan, vegetarian: vegetarian, ingredients: inner})
    }
    return null
}

const getAllAllergenes = (hierarchy) => {
    let allergenes = [];
    if (typeof hierarchy != "undefined" && hierarchy != null) {
        hierarchy.forEach((entry) => {
            allergenes.push(entry.substring(entry.indexOf(":") + 1));
        })
    }

    return allergenes;
}

const getNutriments = (nutriments) => {
    if (typeof nutriments != "undefined" && nutriments != null) {
        return {
            calcium : nutriments.calcium_100g,
            carbohydrates : nutriments.carbohydrates_100g,
            cholesterol : nutriments.cholesterol_100g,
            kcal : nutriments.energy_100g,
            fat : nutriments.fat_100g,
            fiber : nutriments.fiber_100g,
            iron : nutriments.iron_100g,
            proteins : nutriments.proteins_100g,
            salt : nutriments.salt_100g,
            saturated_fat : nutriments['saturated-fat_100g'],
            sodium : nutriments.sodium_100g,
            sugars : nutriments.sugars_100g,
            trans_fat : nutriments['trans-fat_100g'],
            vitamin_a : nutriments['vitamin-a_100g'],
            vitamin_b : nutriments['vitamin-b_100g'],
            vitamin_c : nutriments['vitamin-c_100g'],
            vitamin_d : nutriments['vitamin-d_100g'],
            vitamin_e : nutriments['vitamin-e_100g']
        }
    }
    return null
}

const getNutrimentsScore = (data) => {
    let ret = {
        energy_points : null,
        fiber_points : null,
        negative_points : null,
        positive_points : null,
        proteins_points : null,
        saturated_fat_points : null,
        sodium_points : null,
        sugars_points : null,
        total_grade: null,
        total_score: null,
    }
    if (typeof data.nutriscore_data != "undefined" && data.nutriscore_data != null) {
        ret.energy_points = data.nutriscore_data.energy_points
        ret.fiber_points = data.nutriscore_data.fiber_points
        ret.negative_points = data.nutriscore_data.negative_points
        ret.positive_points = data.nutriscore_data.positive_points
        ret.proteins_points = data.nutriscore_data.proteins_points
        ret.saturated_fat_points = data.nutriscore_data.saturated_fat_points
        ret.sodium_points = data.nutriscore_data.sodium_points
        ret.sugars_points = data.nutriscore_data.sugars_points
    }
    ret.total_grade = data.nutriscore_grade
    ret.total_score = ret.positive_points - ret.negative_points
    return ret
}

const getEcoScore = (data) => {
    let ret = {
        eco_grade : null,
        eco_score : null,
        epi_score : null,
        transportation_scores : null, // subdivided in countries // mostly empty
        packaging : null, // information about packaging, // mostly empty
        agribalyse : null, // Co2 emission from different parts
    }
    if (typeof data.ecoscore_data != "undefined" && data.ecoscore_data != null && data.ecoscore_grade !== "not-applicable") {
        ret.eco_score = data.ecoscore_score
        ret.epi_score = data.ecoscore_data.adjustments.origins_of_ingredients.epi_score
        ret.transportation_scores = data.ecoscore_data.adjustments.origins_of_ingredients.transportation_scores
        ret.packaging = data.ecoscore_data.adjustments.packaging
        ret.agribalyse = data.ecoscore_data.agribalyse
    }
    ret.eco_grade = data.ecoscore_grade
    return ret
}

export const getProduct = async (req, res) => {
    try {
        const userID = "123e4567-e89b-12d3-a456-426614174000"//here insert checking for existing acces_token in EndUser and find user
        
        let response = {
            name: null,
            keywords: [],
            allergens: [],
            categories: [],
            qualities: [],
            warings: [],
            ecoscoreData: [],
            packing: [],
            images: [],
            ingredients: [],
            nutriments_g_pro_100g: [],
            nutriments_scores: []
        }
        const url = `https://world.openfoodfacts.org/api/2/product/${req.params.barcode}.json`
        const product = await axios.get(url)
        if (typeof product === "undefined" || product == null) {
            res.status(500).send({error: "undefined response from OpenFoodFacts Api"})
        }

        if (product.data.status != 1) {
            res.status(204).send({response: "Product not found"})
            return
        }

        if (typeof product === "object" && product.data && product.data.product) {
            const data = product["data"]["product"];
            response.keywords = data["_keywords"];
            response.allergens = getAllAllergenes(data["allergens_hierarchy"]);
            response.categories = data["categories"] ? data["categories"].split(',') : [];
            response.qualities = data["data_quality_tags"];
            response.warings = data["data_quality_warnings_tags"];
            response.ecoscoreData = getEcoScore(data);
            response.packing = data["packaging"];
            response.name = product.data.product.product_name
            if (typeof data["image_front_url"] === "undefined" || data["image_front_url"] == null)
                response.images = null;
            else
                response.images = data["image_small_url"];
            if (product.data.product && product.data.product.ingredients) {
                response.ingredients = getInnerIngredients(product.data.product)
            }
            if (product.data.product && product.data.product.nutriments) {
                response.nutriments_g_pro_100g = getNutriments(product.data.product.nutriments)
            }
            insertIntoHistory(userID, req.params.barcode, response)
            response.nutriments_scores = getNutrimentsScore(product.data.product)
        }

        res.status(200).send(response)
    } catch(error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
}
