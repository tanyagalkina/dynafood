import jwt from 'jsonwebtoken';
import { db_adm_conn } from '../../modules/db/index.js'
import { checkInputBeforeSqlQuery } from '../../modules/db/scripts.js'
export const checkUserExists = async (user) => {
    if (typeof user.userid == "undefined" || user.userid == null)
        return false
    let response = await db_adm_conn.query(`
    SELECT COUNT enduserid FROM enduser WHERE enduserid = '${checkInputBeforeSqlQuery(user.userid)}`)
    if (response.rows[0].count == 1) {
        return true
    }
    return false
}

export const secureRouteMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    let header_token = req.headers['authorization']
    if (typeof token != "undefined" && token != null) {
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            req.user = user;
            if (!checkUserExists(user))
                throw  "user does not exist"
            next();
        } catch(error) {
            res.clearCookie("token");
            res.status(401).send({ "Error": "401 Unauthorized" });
        }
    } else
     if (typeof header_token != "undefined" && header_token != null) {
        try {
            if (header_token.indexOf("Bearer ") != 0)
                throw "no valid bearer"
            header_token = header_token.substring(7)
            console.log(header_token)
            const user = jwt.verify(header_token, process.env.JWT_SECRET);
            req.user = user;
            if (!checkUserExists(user))
                throw  "user does not exist"
            next();
        } catch(error) {
            res.status(401).send({ "Error": "401 Unauthorized" });
        }
    } else {
        res.status(401).send({ "Error": "401 Unauthorized" });
    }
};
