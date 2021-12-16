//import { db_adm_conn } from "./index.js";
import { checkInputBeforeSqlQuery } from './scripts.js';
import db_adm_conn from "./index.js";

export const getSettings = async (req, res) => {
    try {
        let userSettings = await db_adm_conn.query(`
                SELECT restrictionName, EndUser_Restriction.alertActivation FROM Restriction
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
        let newSettings = await db_adm_conn.query(`
            INSERT INTO EndUser_Restriction (alertActivation, endUserId, restrictionID)
            SELECT
                ${checkInputBeforeSqlQuery(req.body.alertActivation)},
                '${checkInputBeforeSqlQuery(req.user.userid)}',
                '${checkInputBeforeSqlQuery(req.restrictionID.rows[0].restrictionid)}'
            WHERE NOT EXISTS (SELECT * FROM EndUser_Restriction EU
            WHERE EU.endUserID = '${checkInputBeforeSqlQuery(req.user.userid)}'
            AND EU.restrictionID = '${checkInputBeforeSqlQuery(req.restrictionID.rows[0].restrictionid)}');
        `);
        res.status(200).send(newSettings.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
};


export const patchSettings = async (req, res) => {
    try {
        let newSettings = await db_adm_conn.query(`
            UPDATE EndUser_Restriction
            SET alertActivation = ${checkInputBeforeSqlQuery(req.body.alertActivation)}
            WHERE restrictionID = '${checkInputBeforeSqlQuery(req.restrictionID.rows[0].restrictionid)}'
            AND endUserID = '${checkInputBeforeSqlQuery(req.user.userid)}';
        `)
        res.status(200).send(newSettings.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
}

export const deleteSettings = async (req, res) => {
    try {
        let newSettings = await db_adm_conn.query(`
            DELETE FROM EndUser_Restriction
            WHERE restrictionID = '${checkInputBeforeSqlQuery(req.restrictionID.rows[0].restrictionid)}'
            AND endUserID = '${checkInputBeforeSqlQuery(req.user.userid)}';
        `)
        res.status(200).send(newSettings.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
}
