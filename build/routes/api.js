"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonschema_1 = __importDefault(require("jsonschema"));
const token_1 = __importDefault(require("../helpers/token"));
const User_1 = __importDefault(require("../models/User"));
const Errors_1 = require("../helpers/Errors");
//Schemas
const userAuth_json_1 = __importDefault(require("../schemas/userAuth.json"));
const APIRouter = express_1.default.Router();
//User sign-in route
APIRouter.post("/token", async function (req, res, next) {
    const validator = jsonschema_1.default.validate(req.body, userAuth_json_1.default);
    try {
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new Errors_1.BadRequest(errs);
        }
        const { username, password } = req.body;
        const user = await User_1.default.auth(username, password);
        //User will throw an error if the username/password is incorrect
        const token = token_1.default(user);
        return res.json({ token });
    }
    catch (e) {
        return next(e);
    }
});
//User sign-up route
APIRouter.post("/register", async function (req, res, next) {
    const validator = jsonschema_1.default.validate(req.body, userAuth_json_1.default);
    try {
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new Errors_1.BadRequest(errs);
        }
        const { username, password } = req.body;
        const newUser = await User_1.default.register(username, password);
        const token = token_1.default(newUser);
        return res.status(201).json({ token });
    }
    catch (e) {
        return next(e);
    }
});
exports.default = APIRouter;
