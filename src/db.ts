import {Client} from "pg";
import {getDatabaseUri} from "./config";

/*
    * database object and setup
*/

let db: Client;

if (process.env.NODE_ENV === "production") {
    db = new Client({
        connectionString: getDatabaseUri(),
        ssl: {
            rejectUnauthorized: false
        }
    });
}
else {
    db = new Client({
        connectionString: getDatabaseUri()
    });
}

//Connect to db
db.connect();

export default db;
