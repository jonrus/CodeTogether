import dotenv from "dotenv";
dotenv.config();

/*
    * Various config consts or functions
*/

export const SECRET_KEY = process.env.SECRET_KEY || "super-secret-dev-key";
export const PORT = process.env.PORT || 3001; 
export const BCRYPT_WF = process.env.NODE_ENV === "test" ? 1 : 12;

export function getDatabaseUri() {
    return (process.env.NODE_ENV === "test") ? "collabtext_test" : "collabtext";
}


console.log("================= BACKEND CONFIG =================");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("SECRET_KEY:", SECRET_KEY);
console.log("Port:", PORT.toString());
console.log("Bcrypt:", BCRYPT_WF);
console.log("DB Uri:", getDatabaseUri());
console.log("==================================================");
