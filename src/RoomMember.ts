import Room from "./Room";

export default class RoomMember{
    protected _send: Function;
    room: Room;
    name: string;
    isOwner: boolean

    constructor(send: Function, roomID: string, name: string, isOwner = false) {
        this._send = send;
        this.room = Room.get(roomID);
        this.name = name;
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

    handleJoin() {
        this.room.join(this);
        this.room.broadcast({
            type: "join",
            payload: `${this.name} joined`
        });
    }

    handleChatMsg(msg: string) {
        this.room.broadcast({
            name: this.name,
            type: "chat",
            payload: msg
        });
    }

    handleNewChatMsg(jsonMsg: any) { //!Type
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