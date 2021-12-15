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

/*
    currently there are only the restrictions 'deez' & 'nutz' hardcoded in the database
    body:
    {
        restrictionName: '',
        alertActivation: (true of false),
    }
*/
export const postSettings = async (req, res) => {
    try {
        let restrictionID = await db_adm_conn.query(`
            SELECT restrictionID
            FROM Restriction
            WHERE restrictionName = '${req.body.restrictionName}'
        `);

        let newSettings = await db_adm_conn.query(`
            INSERT INTO EndUser_Restriction (alertActivation, endUserId, restrictionID)
            SELECT
                ${req.body.alertActivation},
                '${req.user.userid}',
                '${restrictionID.rows[0].restrictionid}'
            WHERE NOT EXISTS (SELECT * FROM EndUser_Restriction EU
            WHERE EU.endUserID = '${req.user.userid}' AND EU.restrictionID = '${restrictionID.rows[0].restrictionid}');
        `);
        res.status(200).send(newSettings.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
};
