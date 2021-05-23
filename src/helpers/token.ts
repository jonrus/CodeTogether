import {sign} from "jsonwebtoken";
import {SECRET_KEY} from "../config";

export default function makeJWT(user: string) {
    let payload = {username: user};
    return sign(payload, SECRET_KEY);
}
