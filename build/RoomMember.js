"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = __importDefault(require("./Room"));
class RoomMember {
    constructor(send, roomID, name, userLevel = 1) {
        this._send = send;
        this.room = Room_1.default.get(roomID);
        this.name = name;
        this.userLevel = userLevel;
        console.log(`${this.name} joined ${this.room.id}`);
    }
    send(data) {
        try {
            this._send(data);
        }
        catch {
            console.log(`Unable to send data to user: ${this.name}`);
        }
    }
    handleJoin() {
        this.room.join(this);
        this.room.broadcast({
            type: "join",
            payload: `${this.name} joined`
        });
    }
    handleChatMsg(msg) {
        this.room.broadcast({
            name: this.name,
            type: "chat",
            payload: msg
        });
    }
    handleNewChatMsg(jsonMsg) {
        const msg = JSON.parse(jsonMsg);
        switch (msg.type) {
            case "join":
                this.handleJoin();
                break;
            case "leave":
                this.handleCloseConnection();
                break;
            case "chat":
                this.handleChatMsg(msg);
                break;
            default:
                throw new Error(`Unknown message type: ${msg.type}`);
        }
    }
    handleCloseConnection() {
        this.room.leave(this);
        this.room.broadcast({
            type: "leave",
            payload: `${this.name} has left the room`
        });
    }
}
exports.default = RoomMember;
