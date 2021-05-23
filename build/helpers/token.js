"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
function makeJWT(user) {
    let payload = { username: user };
    return jsonwebtoken_1.sign(payload, config_1.SECRET_KEY);
}
exports.default = makeJWT;
