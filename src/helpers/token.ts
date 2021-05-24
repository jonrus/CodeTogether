import {sign, verify} from "jsonwebtoken";
import {SECRET_KEY} from "../config";

export function makeJWT(user: string) {
    let payload = {username: user};
    return sign(payload, SECRET_KEY, {expiresIn: '12h'});
}

export function checkJWT(token: string) {
    //Only the most basic security - We're not really gating much in the app...
    try {
        verify(token, SECRET_KEY);
        return true;
    }
    catch {
        return false
    }
}
