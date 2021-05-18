"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("@codemirror/state");
const Room_1 = __importDefault(require("./Room"));
class RoomMember {
    constructor(send, roomID, isOwner = false) {
        this._send = send;
        this.room = Room_1.default.get(roomID);
        this.name = "";
        this.isOwner = isOwner;
        console.log("New ws client...");
    }
    send(data) {
        console.log(`Data to send: ${data}`);
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
    handleUpdates(msg) {
        //Client and Server an in sync
        console.log("Change version: ", msg.version);
        if (msg.version === this.room.docUpdates.length) {
            for (let update of msg.updates) {
                let changes = state_1.ChangeSet.fromJSON(update.changes);
                this.room.docUpdates.push({ changes, clientID: update.clientID });
                this.room.doc = changes.apply(this.room.doc);
            }
            const sendData = {
                type: "editor-Changes",
                changes: this.room.docUpdates
            };
            this.room.broadcast(sendData);
        }
        console.log("V:", this.room.docUpdates.length);
    }
    handleMessage(jsonMsg) {
        const msg = JSON.parse(jsonMsg);
        console.log("New Message:", msg);
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
            case "editor-PushChanges":
                this.handleUpdates(msg);
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
