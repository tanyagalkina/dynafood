import { db_adm_conn } from "./index.js";
import { checkInputBeforeSqlQuery } from './scripts.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const parseGetUserResponse = (rows) => {
    let userObj = {
        firstName : rows[0].firstname,     
        lastName : rows[0].lastname,
        userName : rows[0].username,
        email : rows[0].email,
        phoneNumber : rows[0].phonenumber,
        restrictons: []
    };
    for (var row of rows) {
        if (row.restrictionName != null)
        userObj.restrictons.push( {
            alertActivation: row.alertactivation,
            restrictionName: row.restrictionname
        });
    }
    return userObj;
};

export const getUser = async (req, res) => {
    try {
        let newUser = await db_adm_conn.query(`
        SELECT EU.firstName, EU.lastName, EU.userName, EU.email, EU.phoneNumber, ER.alertActivation, R.restrictionName
        FROM EndUser EU
        LEFT JOIN EndUser_Restriction ER ON ER.endUserID = EU.endUserID
        LEFT JOIN Restriction R ON R.restrictionID = ER.restrictionID
        WHERE EU.endUserID = '${checkInputBeforeSqlQuery(req.user.userid)}';`);
        if (newUser.rows.length == 0) {
            res.status(404).send("There is no EndUser with this id.");
            return;
        }
        res.send(parseGetUserResponse(newUser.rows));
    } catch(err) {
        console.log(err.stack);
        res.status(500).send({"Error": err, "Details": err.stack});
    }
    return;
};

export const deleteUser = async (req, res) => {
    try {
        let response = await db_adm_conn.query(`
        DELETE FROM EndUser
        WHERE endUserID = '${checkInputBeforeSqlQuery(req.user.userid)}' RETURNING *;`);
        res.send({"Deleted": response.rows});
    } catch (err) {
        console.log(err.stack);
        res.status(500).send({"Error": err, "Details": err.stack});
    }
};

export const createUser = async (req, res) =>
{
    try {
        const passcode = await bcrypt.hash(req.body.password, 10)
        let user = await db_adm_conn.query(`
        INSERT INTO EndUser (firstName, lastName, userName, email, phoneNumber, passcode, emailConfirmed)
        VALUES 
            (
                '${req.body.firstName}',
                '${req.body.lastName}',
                '${req.body.userName}',
                '${req.body.email}',
                '${req.body.phoneNumber}', 
                '${passcode}',
                true
            ) RETURNING *;`);
        const userid = user.rows[0].enduserid;
        const token = jwt.sign({ userid: userid, password: req.body.password }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
        });
        res.status(200).send(token);
        return;
    } catch (error)  {
        res.status(400).send({"Error": "Unable to create new User.", "Details": `${error}`});
        return;
    }
};


export const getToken = async (req, res) => {
    const email = req.query.email;
    const password = req.query.password;

    const user = await db_adm_conn.query(`
        SELECT *
        FROM EndUser
        WHERE email = '${email}';
    `);

    if (user.rows.length == 0) {
        console.log(`There is no user with the email: ${email}`);
        res.status(404).send({"Error": `There is no user with the email ${email}`});
        return;
    }

    if (user.rowCount == 0) {
        res.status(404).send({"Error": `User has no rows`});
        return;
    }

    const correctPassword = await bcrypt.compare(password, user.rows[0].passcode);
    if (user.rows[0].email == email && correctPassword) {
        const userid = user.rows[0].enduserid;
        const token = jwt.sign({ userid: userid, password: password }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
        });
        res.status(200).send(token);
        return;
    }
    res.status(401).send({ "Error": "Wrong credentials" });
};