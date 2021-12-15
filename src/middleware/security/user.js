import { db_adm_conn } from "../../modules/db/index.js";
import Joi from "joi";

const schema = Joi.object({
    firstName   : Joi.string()
                    .pattern(new RegExp('^[a-zA-Z\s\-]'))
                    .min(3)
                    .max(20)
                    .required(),
    lastName    : Joi.string()
                    .pattern(new RegExp('^[a-zA-Z\s\-]'))
                    .min(3)
                    .max(20)
                    .required(),
    userName    : Joi.string()
                    .pattern(new RegExp('^[a-zA-Z0-9]'))
                    .min(3)
                    .max(20)
                    .required(),
    email       : Joi.string()
                    .email(
                        {
                            minDomainSegments: 2,
                            tlds: {
                                allow: ['com', 'net', 'eu', 'de', 'fr']
                            }
                        })
                    .required(),
    phoneNumber : Joi.string()
                    .pattern(new RegExp('^[0-9\s\+]'))
                    .min(8)
                    .max(20)
                    .required(),
    password    : Joi.string()
                    .min(8)
                    .max(72)
                    .required()
})

export const checkUserIdReq = (req, res, next) => {
    if (typeof req.user.userid == 'undefined' || req.user.userid === null) {
        res.status(400).send({"Error": "No valid token provided."})
        return
    }
    next()
}

export const checkCreateUserReq = (req, res, next) => {
    const { error, value } = schema.validate(req.body)
    if (error != undefined) {
        res.send(400).send({"Error": error})
        return
    }
    let prevCheckEmail = await db_adm_conn.query(`
        SELECT email
        FROM EndUser
        WHERE endUserID = ${checkInputBeforeSqlQuery(req.body.email)}`)
    if (prevCheckEmail.rowCount != 0) {
        res.status(409).send({"Error": "email already exists"})
        return
    }
    next()
}