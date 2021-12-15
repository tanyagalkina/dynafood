//import { db_adm_conn } from "./index.js";
import { checkInputBeforeSqlQuery } from './scripts.js';
import db_adm_conn from "./index.js";

export const getSettings = async (req, res) => {
    try {
        let userSettings = await db_adm_conn.query(`
                SELECT restrictionName FROM Restriction
                JOIN EndUser_Restriction USING (restrictionID)
                WHERE endUserID = '${checkInputBeforeSqlQuery(req.user.userid)}';`);
        if (userSettings.rows.length == 0) {
            res.status(404).send({ "Error": "User does not have any settings." });
            return
        }
        res.status(200).send(userSettings.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
};
