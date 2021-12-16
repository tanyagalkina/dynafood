import db_adm_conn from "../modules/db/index.js";


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
