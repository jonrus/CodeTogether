"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = require("bcrypt");
const config_1 = require("../config");
const Errors_1 = require("../helpers/Errors");
class User {
    static async auth(username, password) {
        const res = await db_1.default.query(`
        SELECT username, password
        FROM users
        WHERE username = $1
        `, [username]);
        const user = res.rows[0];
        if (user) {
            const passMatch = await bcrypt_1.compare(password, res.rows[0].password);
            if (passMatch === true) {
                delete user.password;
                return user;
            }
        }
        //No user
        throw new Errors_1.Unauth("Invalid username/password");
    }
    static async register(username, password) {
        const hashedPass = await bcrypt_1.hash(password, config_1.BCRYPT_WF);
        try {
            const res = await db_1.default.query(`
                INSERT INTO users
                (username, password)
                VALUES ($1, $2)
                RETURNING username
            `, [username, hashedPass]);
            return res.rows[0];
        }
        catch (e) {
            throw new Errors_1.BadRequest("Duplicate username");
        }
    }
}
exports.default = User;
