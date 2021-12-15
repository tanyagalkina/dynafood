import pg from 'pg'

import { DB_STRING } from '../../config/index.js';
// const port = 8081
const Client = pg.Client;
const Pool = pg.Pool;


//const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
const connectionString =  process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}${DB_STRING}`


export const poolExample = (req, res) => {

    console.log('[EXAMPLE] I am DB Pool example func')

    let pool;
    
    if (process.env.NODE_ENV  == 'production')
    
       { pool = new Pool({
    
            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            ssl: {
                 rejectUnauthorized: false,
                },
            });
        } 

    else pool = new Pool({
        connectionString: connectionString,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    })
    
    
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        client.query('SELECT NOW()', (err, result) => {
            release()
            if (err) {
            return console.error('Error executing query', err.stack)
            }
        console.log(result.rows)
        res.status(200).send(result.rows)
        })
    })    
}

let db_adm_conn;
if (process.env.NODE_ENV !== 'production') {
    db_adm_conn = new Client({
        connectionString,
      });    

} else {
    db_adm_conn = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}
  
db_adm_conn.connect();

  
export const showTables = (req, res) => { 
    db_adm_conn.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
    });
    res.status(200).json({"msg" : "showtables function"})
}  

// export function connect() {
//     let db_adm_conn;
//     if (process.env.NODE_ENV !== 'production') {
//         db_adm_conn = new Client({
//             connectionString
//         });
//     }
//     else {
//         db_adm_conn = new Client({
//             connectionString,
//             ssl: {
//                 rejectUnauthorized: false
//             }
//         });
//     }
//     db_adm_conn.on('error', error => {
//         connect();
//     });
//     db_adm_conn.connect().catch(() => { connect() });
//     return db_adm_conn
// }
// let db_adm_conn = connect()


export const whatTimePGQL = (res, req) => {

    db_adm_conn.query('SELECT NOW()', (err, result) => {
        if (err) {
            res.status(500).json(err.stack)
            return console.error('Error executing query', err.stack)
        }
    console.log(result.rows)
    res.status(200).send(result.rows)
    })
}

export const getEcho = async (req, res) => {
    res.send(JSON.stringify(req.query));
};

export const getUsers = async (req, res) => {
    console.log('[LOGGER], getUsers func')
    res.send(await db_adm_conn.query(`SELECT * FROM EndUser`));
};

export const getUser = async (req, res) => {
    if (req.query.email === undefined && req.query.id === undefined) {
        res.status(400).send({"Error": "No valid search param provided. (Must be either 'email' or 'id'.)"})
        return
    }
    if (req.query.email !== undefined && req.query.id !== undefined) {
        res.status(400).send({"Error": "You must provide either 'email' or 'id' and cannot search by both."})
        return
    }

    let newUser = (req.query.email !== undefined ?
        await db_adm_conn.query(`SELECT *
                                          FROM EndUser
                                          WHERE email = '${req.query.email}';`) :
        await db_adm_conn.query(`SELECT *
                                          FROM EndUser
                                          WHERE enduserid = '${req.query.id}';`))

    if (req.query.email !== undefined) {
        if (newUser.rows.length == 0) {
            res.status(404).send("There is no EndUser with this email.")
            return
        }
        res.send(newUser.rows[0]);
        return
    } else {
        if (newUser.rows.length == 0) {
            res.status(404).send("There is no EndUser with this id.")
            return
        }
        res.send(newUser.rows[0]);
        return
    }
};

export const deleteUser = async (req, res) => {
    if (req.query.email === undefined && req.query.id === undefined) {
        res.status(400).send({"Error": "No valid search param provided. (Must be either 'email' or 'id'.)"})
        return
    }
    if (req.query.email !== undefined && req.query.id !== undefined) {
        res.status(400).send({"Error": "You must provide either 'email' or 'id' and cannot search by both."})
        return
    }

    let newUser = (req.query.email !== undefined ?
        await db_adm_conn.query(`SELECT *
                                          FROM EndUser
                                          WHERE email = '${req.query.email}';`) :
        await db_adm_conn.query(`SELECT *
                                          FROM EndUser
                                          WHERE enduserid = '${req.query.id}';`))
    if (req.query.email !== undefined) {
        await db_adm_conn.query(`DELETE FROM EndUser
                                 WHERE email = '${req.query.email}';`)
    } else {
        await db_adm_conn.query(`DELETE FROM EndUser
                                 WHERE enduserid = '${req.query.id}';`)
    }
    if (req.query.email !== undefined) {
        if (newUser.rows.length == 0) {
            res.status(200).send("Nothing changed, as there is no EndUser with this email.")
            return
        }
        res.send({"Deleted": newUser.rows[0]});
        return
    } else {
        if (newUser.rows.length == 0) {
            res.status(200).send("Nothing changed, as there is no EndUser with this id.")
            return
        }
        res.send({"Deleted": newUser.rows[0]});
    }
};

export const postUser = async (req, res) =>
{
    if (req.query.firstName === undefined) {
        res.status(400).send({"Error": "Missing required param 'firstName'."})
        return
    }
    if (req.query.lastName === undefined) {
        res.status(400).send({"Error": "Missing required param 'lastName'."})
        return
    }
    if (req.query.userName === undefined) {
        res.status(400).send({"Error": "Missing required param 'userName'."})
        return
    }
    if (req.query.email === undefined) {
        res.status(400).send({"Error": "Missing required param 'email'."})
        return
    }
    if (req.query.phoneNumber === undefined) {
        res.status(400).send({"Error": "Missing required param 'phoneNumber'."})
        return
    }
    if (req.query.passcode === undefined) {
        res.status(400).send({"Error": "Missing required param 'passcode'."})
        return
    }
    if (req.query.emailConfirmed === undefined) {
        res.status(400).send({"Error": "Missing required param 'emailConfirmed'."})
        return
    }

    try {
        let newUser = await db_adm_conn.query(`INSERT INTO EndUser (firstName, lastName, userName, email, phoneNumber, passcode, emailConfirmed)
                                 VALUES ('${req.query.firstName}', '${req.query.lastName}', '${req.query.userName}',
                                     '${req.query.email}', '${req.query.phoneNumber}', '${req.query.passcode}',
                                     '${req.query.emailConfirmed}')
                                     RETURNING *;
                                 `)
        res.send(newUser.rows[0]);
        return
    } catch (error)  {
        res.status(400).send({"Error": "Unable to create new User.", "Details": `${error}`});
        return
    }
};