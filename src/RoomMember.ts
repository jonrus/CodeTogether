import Room from "./Room";

export default class RoomMember{
    protected _send: Function;
    room: Room;
    name: string;
    isOwner: boolean

    constructor(send: Function, roomID: string, isOwner = false) {
        this._send = send;
        this.room = Room.get(roomID);
        this.name = "pending"; //Set in handleJoin
        this.isOwner = isOwner;

        console.log(`${this.name} joined ${this.room.id}`);
    }

    send(data: unknown) { //!Set type/interface
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
            text: `${this.name} joined ${this.room.id}`
        });
    }

    handleChat(msg: string) {
        this.room.broadcast({
            name: this.name,
            type: "chat",
            text: msg
        });
    }


    // handleMessage(jsonData: any) {
    //     let msg = JSON.parse(jsonData);

    //     if (msg.type === "join") this.handleJoin(msg.name);
    //     else if (msg.type === "chat") this.handleChat(msg.text);
    //     else throw new Error(`bad message: ${msg.type}`);
    // }

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