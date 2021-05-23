"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const RoomMember_1 = __importDefault(require("./RoomMember"));
//Routes
const api_1 = __importDefault(require("./routes/api"));
//App
exports.app = express_ws_1.default(express_1.default()).app;
//Serve static files
exports.app.use(express_1.default.static('static/'));
exports.app.use(express_1.default.json());
//Set up routes
exports.app.use("/api", api_1.default);
//*Websocket Routes
exports.app.ws("/room/:ID", function (ws, req, next) {
    try {
        const owner = req.params.owner ? true : false;
        const user = new RoomMember_1.default(ws.send.bind(ws), req.params.ID, owner);
        //Set up socket handlers
        ws.on('message', function (data) {
            try {
                user.handleMessage(data);
            }
            catch (e) {
                console.error(e);
            }
        });
        ws.on('close', function () {
            try {
                user.handleCloseConnection();
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    catch (e) {
        console.error(e);
    }
});
//TODO: Update to always serve the Frontend
exports.app.get("/room/:ID", function (req, res, next) {
    res.sendFile(`${__dirname}/chat.html`);
});
//Error catch
exports.app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV === "test") {
        console.error(err.stack);
    }
    const status = err.status || 500;
    return res.status(status).json({ error: { message: err.msg, status } });
});
