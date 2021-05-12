"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = __importDefault(require("./Room"));
class RoomMember {
    constructor(send, roomID, isOwner = false) {
        this._send = send;
        this.room = Room_1.default.get(roomID);
        this.name = "pending"; //Set in handleJoin
        this.isOwner = isOwner;
        console.log("New ws client...");
    }
    send(data) {
        try {
            this._send(data);
        }
        catch {
            console.log(`Unable to send data to user: ${this.name}`);
        }
    }
    handleJoin(username) {
        this.name = username;
        this.room.join(this);
        this.room.broadcast({
            type: "note",
            text: `${this.name} joined ${this.room.id}`
        });
        console.log(`${this.name} joined ${this.room.id}`);
    }
    handleChat(msg) {
        this.room.broadcast({
            name: this.name,
            type: "chat",
            text: msg
        });
    }
    handleMessage(jsonMsg) {
        const msg = JSON.parse(jsonMsg);
        console.log(msg);
        switch (msg.type) {
            case "join":
                this.handleJoin(msg.name);
                break;
            case "chat":
                this.handleChat(msg.text);
                break;
            default:
                throw new Error(`Unknown message type: ${msg.type}`);
        }
    }
    handleCloseConnection() {
        console.log("leaving");
        this.room.leave(this);
        this.room.broadcast({
            type: "note",
            text: `${this.name} has left the room`
        });
    }
}
exports.default = RoomMember;
