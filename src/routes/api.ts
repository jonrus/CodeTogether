import express from "express";
import jsonschema from "jsonschema";
import {makeJWT, checkJWT} from "../helpers/token";
import User from "../models/User";
import {BadRequest} from "../helpers/Errors";
import Room from "../Room";

//Schemas
import userAuthSchema from "../schemas/userAuth.json";

const APIRouter = express.Router();

//User sign-in route
APIRouter.post("/token", async function (req, res, next) {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    try {
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequest(errs);
        }

        const {username, password} = req.body;
        const user = await User.auth(username, password);
        //User will throw an error if the username/password is incorrect
        const token = makeJWT(user);
        return res.json({token});
    }
    catch (e) {
        return next(e);
    }
});

//User sign-up route
APIRouter.post("/register", async function (req, res, next) {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    try {
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequest(errs);
        }

        const {username, password} = req.body;
        const newUser = await User.register(username, password);
        const token = makeJWT(newUser);
        return res.status(201).json({token});
    }
    catch (e) {
        return next(e);
    }
});

//Get a new room name
APIRouter.post("/new-room-name", async function (req, res, next) {
    const {token} = req.body;
    if (checkJWT(token)) {
        const roomName = Room.newRoomName();
        return res.json({roomName});
    }
    return res.json({error: "Invalid account"});
});

export default APIRouter;
