import db_adm_conn from "./index.js";
import { checkInputBeforeSqlQuery } from './scripts.js';

export const insertIntoHistory = async (userID, barcode, product) => {

    userID = checkInputBeforeSqlQuery(userID);
    barcode = checkInputBeforeSqlQuery(barcode);
    product.name = checkInputBeforeSqlQuery(product.name);
    product.images = checkInputBeforeSqlQuery(product.images);

    await db_adm_conn.query(`
    INSERT INTO history (endUserID, barcode, productName, pictureLink) 
    VALUES ('${userID}', '${barcode}', '${product.name}', '${product.images}');`)
}

export const deleteElementFromHistory = async (req, res) => {
    const elementID = checkInputBeforeSqlQuery(req.params.elementID);
    await db_adm_conn.query(`
    DELETE FROM history 
    WHERE historyID = '${elementID}';`)
    res.send("DELETED")
}

export const getElementsFromHistory = async (req, res) => {
    const userID = checkInputBeforeSqlQuery(req.user.userid);
    var response = await db_adm_conn.query(`
    SELECT H.historyID, H.barcode, H.productName, H.lastUsed, H.pictureLink
    FROM History H
    JOIN EndUser EU ON EU.endUserID = H.endUserID
    WHERE EU.endUserID = '${userID}'
    ORDER BY H.lastused DESC;`)
    res.send( { elements: response.rows })
}
