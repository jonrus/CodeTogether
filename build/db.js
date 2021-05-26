"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("./config");
/*
    * database object and setup
*/
let db;
if (process.env.NODE_ENV === "production") {
    db = new pg_1.Client({
        connectionString: config_1.getDatabaseUri(),
        ssl: {
            rejectUnauthorized: false
        }
    });
}
else {
    db = new pg_1.Client({
        connectionString: config_1.getDatabaseUri()
    });
}
//Connect to db
db.connect();
exports.default = db;
