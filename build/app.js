"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const RoomMember_1 = __importDefault(require("./RoomMember"));
//App
exports.app = express_ws_1.default(express_1.default()).app;
//Serve static files
// app.use(express.static('static/'));
console.log(__dirname);
//*Websocket Routes
exports.app.ws("/rooms/:ID", function (ws, req, next) {
    try {
        const owner = req.params.owner ? true : false;
        const user = new RoomMember_1.default(ws.send.bind(ws), req.params.ID, req.params.name, owner);
        //Set up socket handlers
        ws.on('message', function (data) {
            try {
                user.handleNewChatMsg(data);
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
