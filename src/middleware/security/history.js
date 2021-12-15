// import { deleteElementFromHistory, getElementsFromHistory } from '../../modules/db/historyManagement.js'
import db_adm_conn from "../../modules/db/index.js";

export const checkDeleteElementReq = async (req, res, next) => {
    //check access_token here

    //check if user from access_token is the owner of the element
    var elementID = req.params.elementID
    if (typeof elementID == "undefined" || elementID == null) {
        res.status(400).send('elementID is missing')
        return
    }
    next()
}

export const checkGetElementsFromHistoryReq = async (req, res, next) => {
    //check access_token here

    var userID = req.query.userID
    if (typeof userID == "undefined" || userID == null) {
        res.status(400).send('userID is missing')
        return
    }
    next()
}