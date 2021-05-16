import Room from "./Room";

export default class RoomMember{
    protected _send: Function;
    room: Room;
    name: string;
    isOwner: boolean

    constructor(send: Function, roomID: string, isOwner = false) {
        this._send = send;
        this.room = Room.get(roomID);
        this.name = "";
        this.isOwner = isOwner;

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
            //text: msg
            text: `${this.name}: ${msg}`
        });
    }

    handleEditorGetDoc() {
        const data = JSON.stringify({
            type: "editor-Doc",
            version: this.room.docUpdates.length,
            doc: this.room.doc.toString()});

        this._send(data);
    }

    handleMessage(jsonMsg: any) { //!Type
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