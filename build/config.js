"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseUri = exports.BCRYPT_WF = exports.PORT = exports.SECRET_KEY = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/*
    * Various config consts or functions
*/
exports.SECRET_KEY = process.env.SECRET_KEY || "super-secret-dev-key";
exports.PORT = process.env.PORT || 3001;
exports.BCRYPT_WF = process.env.NODE_ENV === "test" ? 1 : 12;
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test") ? "collabtext_test" : "collabtext";
}
exports.getDatabaseUri = getDatabaseUri;
console.log("================= BACKEND CONFIG =================");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("SECRET_KEY:", exports.SECRET_KEY);
console.log("Port:", exports.PORT.toString());
console.log("Bcrypt:", exports.BCRYPT_WF);
console.log("DB Uri:", getDatabaseUri());
console.log("==================================================");
