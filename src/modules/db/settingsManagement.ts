//import { db_adm_conn } from "./index";
import { checkInputBeforeSqlQuery } from './scripts';
import db_adm_conn from "./index";

export const getSettings = async (req: Request, res: Response) => {
    try {
        let userSettings = await db_adm_conn.query(`
                SELECT R.restrictionName, ER.alertActivation 
                FROM Restriction R
                LEFT JOIN EndUser_Restriction ER ON ER.restrictionID = R.restrictionID
                WHERE ER.endUserID = '${checkInputBeforeSqlQuery(req.body.user.userid)}';`);
        if (userSettings.rows.length == 0) {
            res.status(204).send();
            return
        }
        res.status(200).send(userSettings.rows);
    } catch (err: any) {
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
export const postSettings = async (req: Request, res: Response) => {
    try {
        let newSettings = await db_adm_conn.query(`
            INSERT INTO EndUser_Restriction (alertActivation, endUserId, restrictionID)
            SELECT
                ${checkInputBeforeSqlQuery(req.body.alertActivation)},
                '${checkInputBeforeSqlQuery(req.body.user.userid)}',
                '${checkInputBeforeSqlQuery(req.restrictionID.rows[0].restrictionid)}'
            WHERE NOT EXISTS (SELECT * FROM EndUser_Restriction EU
            WHERE EU.endUserID = '${checkInputBeforeSqlQuery(req.body.user.userid)}'
            AND EU.restrictionID = '${checkInputBeforeSqlQuery(req.restrictionID.rows[0].restrictionid)}');
        `);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
};


export const patchSettings = async (req: Request, res: Response) => {
    try {
        let newSettings = await db_adm_conn.query(`
            UPDATE EndUser_Restriction
            SET alertActivation = ${checkInputBeforeSqlQuery(req.body.alertActivation)}
            WHERE restrictionID = '${checkInputBeforeSqlQuery(req.restrictionID.rows[0].restrictionid)}'
            AND endUserID = '${checkInputBeforeSqlQuery(req.body.user.userid)}';
        `)
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
}

export const deleteSettings = async (req: Request, res: Response) => {
    try {
        let newSettings = await db_adm_conn.query(`
            DELETE FROM EndUser_Restriction
            WHERE restrictionID = '${checkInputBeforeSqlQuery(req.restrictionID.rows[0].restrictionid)}'
            AND endUserID = '${checkInputBeforeSqlQuery(req.body.user.userid)}';
        `)
        res.status(200).send(newSettings.rows);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
}
