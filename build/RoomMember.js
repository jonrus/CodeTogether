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
        this.name = ""; //Set in handleJoin
        this.isOwner = isOwner;
        console.log("New ws client...");
    }
    send(data) {
        console.log(`Data to send: ${data}`);
        try {
            const res = this._send(data);
            console.log(res);
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
            text: `${this.name} joined the room!`
        });
        console.log(`${this.name} joined ${this.room.id}`);
        //Get the current document from the server
        this.handleEditorGetDoc();
    }
    handleChat(msg) {
        this.room.broadcast({
            name: this.name,
            type: "chat",
            //text: msg
            text: `${this.name}: ${msg}`
        });
    }
    handleEditorGetDoc() {
        const data = JSON.stringify({
            type: "editor-Doc",
            version: this.room.docUpdates.length,
            doc: this.room.doc.toString()
        });
        this._send(data);
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
            case "editor-getDocument":
                this.handleEditorGetDoc();
                break;
            default:
                throw new Error(`Unknown message type: ${msg.type}`);
        }
    }
    handleCloseConnection() {
        this.room.leave(this);
        this.room.broadcast({
            type: "note",
            text: `${this.name} has left the room!`
        });
    }
}
exports.default = RoomMember;
