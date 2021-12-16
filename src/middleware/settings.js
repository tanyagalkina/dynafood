import db_adm_conn from "../modules/db/index.js";
import { checkInputBeforeSqlQuery } from './../modules/db/scripts.js';

export const getRestrictionIdByName = async (req, res, next) => {
    try {
        let restrictionID = await db_adm_conn.query(`
            SELECT restrictionID
            FROM Restriction
            WHERE restrictionName = '${req.body.restrictionName}'
        `);

        req.restrictionID = restrictionID;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
}

export const hasRestriction = async (req, res, next) => {
    try {
        let restriction = await db_adm_conn.query(`
            SELECT * FROM EndUser_Restriction
            WHERE endUserID = '${checkInputBeforeSqlQuery(req.user.userid)}'
            AND restrictionID = '${checkInputBeforeSqlQuery(req.restrictionID.rows[0].restrictionid)}'
        `)

        if (restriction.rowCount == 0) {
            res.status(400).send( {"Error": "Bad request", "Details": `This user does not have a restriction for ${req.body.restrictionName}.` })
            return
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
}
