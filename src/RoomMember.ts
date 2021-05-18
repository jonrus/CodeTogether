import { ChangeSet } from "@codemirror/state";
import Room from "./Room";

export default class RoomMember{
    protected _send: Function;
    room: Room;
    name: string;
    color: string;
    isOwner: boolean;
    docVersion: number;
    selection: Object;

    constructor(send: Function, roomID: string, isOwner = false) {
        this._send = send;
        this.room = Room.get(roomID);
        this.name = "";
        this.color = "red"; //!Set color
        this.isOwner = isOwner;
        this.docVersion = 0;
        this.selection = {from: 0, to: 0};

        console.log("New ws client...");
    }

    send(data: string) {
        console.log(`Data to send: ${data}`);
        try {
            this._send(data);
        }
        catch {
            console.log(`Unable to send data to user: ${this.name}`);
        }
    }

    handleJoin(username: string) {
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

    handleChat(msg: string) {
        this.room.broadcast({
            name: this.name,
            type: "chat",
            text: `${this.name}: ${msg}`,
            msg,
            from: this.name
        });
    }

    handleEditorGetDoc() {
        this.docVersion = this.room.docUpdates.length;

        const data = JSON.stringify({
            type: "editor-Doc",
            version: this.docVersion,
            doc: this.room.doc.toString()});

        this.send(data);
    }

    handleUpdates(msg: any) {
        //Client and Server an in sync
        if (msg.version === this.room.docUpdates.length) {
            this.selection = msg.selection;
            console.log("this selection", this.selection);
            for (let update of msg.updates) {
                const changes = ChangeSet.fromJSON(update.changes);
                this.room.docUpdates.push({changes, clientID: update.clientID});
                this.room.doc = changes.apply(this.room.doc);
            }

            this.room.broadcastChanges();
        }
    }

    handleMessage(jsonMsg: any) { //!Type
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