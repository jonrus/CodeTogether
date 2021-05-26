"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJWT = exports.makeJWT = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
function makeJWT(user) {
    let payload = { username: user };
    return jsonwebtoken_1.sign(payload, config_1.SECRET_KEY, { expiresIn: '12h' });
}
exports.makeJWT = makeJWT;
function checkJWT(token) {
    //Only the most basic security - We're not really gating much in the app...
    try {
        jsonwebtoken_1.verify(token, config_1.SECRET_KEY);
        return true;
    }
    catch {
        return false;
    }
}
exports.checkJWT = checkJWT;
