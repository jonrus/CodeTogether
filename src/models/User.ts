import db from "../db";
import {hash, compare} from "bcrypt";
import {BCRYPT_WF} from "../config";
import {BadRequest, Unauth} from "../helpers/Errors";

export default class User {
    static async auth(username: string, password: string) {
        //Try to auth a user
        //Returns -- Username when username/password is valid
        //Throws -- Unauth() with incorrect username/password OR unknown username
        const res = await db.query(`
        SELECT username, password
        FROM users
        WHERE username = $1
        `, [username]);

        const user = res.rows[0];
        if (user) {
            const passMatch = await compare(password, res.rows[0].password);
            if (passMatch === true) {
                delete user.password;
                return user;
            }
        }

        throw new Unauth("Invalid username/password");
    }

    static async register(username: string, password: string) {
        //Register a user (hash password first)
        //Returns -- Username when user is created
        //Throws -- BadRequest()
        const hashedPass = await hash(password, BCRYPT_WF);

        try {
            const res = await db.query(`
                INSERT INTO users
                (username, password)
                VALUES ($1, $2)
                RETURNING username
            `, [username, hashedPass]);

            return res.rows[0];
        }
        catch (e) {
            throw new BadRequest("Duplicate username");
        }
    }
}
