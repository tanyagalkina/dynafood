import db_adm_conn from "../modules/db/index";
import { checkInputBeforeSqlQuery } from './../modules/db/scripts';
import { Request, Response, NextFunction } from "express";

export const getRestrictionIdByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let restrictionID = await db_adm_conn.query(`
            SELECT restrictionID
            FROM Restriction
            WHERE restrictionName = '${req.body.restrictionName}'
        `);

        req.body.restrictionID = restrictionID;
        next();
    } catch (err: any) {
        console.error(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
}

export const hasRestriction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let restriction = await db_adm_conn.query(`
            SELECT * FROM EndUser_Restriction
            WHERE endUserID = '${checkInputBeforeSqlQuery(req.body.user.userid)}'
            AND restrictionID = '${checkInputBeforeSqlQuery(req.body.restrictionID.rows[0].restrictionid)}'
        `)

        if (restriction.rowCount == 0) {
            res.status(400).send( {"Error": "Bad request", "Details": `This user does not have a restriction for ${req.body.restrictionName}.` })
            return
        }
        next();
    } catch (err: any) {
        console.error(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
}
