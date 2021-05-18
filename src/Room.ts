import RoomMember from "./RoomMember";
import {Text} from "@codemirror/state";
import {Update} from "@codemirror/collab";
/*
    Room class used to manage room, members and document changes
*/

const currentRooms = new Map();

export default class Room {
    //Static method to get room, or add it to the map if it doesn't exist
    static get(roomID: string) {
        if (!currentRooms.has(roomID)) {
            currentRooms.set(roomID, new Room(roomID));
        }

        return currentRooms.get(roomID);
    }

    id: string;
    doc: Text;
    docUpdates: Update[] = [];
    members: Set<RoomMember>;
    constructor(roomID: string) {
        this.id = roomID;
        this.docUpdates = [];
        this.doc = Text.of(["Text"]);
        this.members = new Set();
    }

    //Add a member to the room
    join(member: RoomMember) {
        this.members.add(member);
        this.broadcast(this.memberList());
    }

    //Remove a member from the room
    leave(member: RoomMember) {
        this.members.delete(member);
        this.broadcast(this.memberList());
    }

    //Send message to all memebers of the room
    broadcast(data: Object) { //!Detrmine data type/interface
        for (let mem of this.members) {
            mem.send(JSON.stringify(data));
        }
    }

    //Create a JSON object to send to out all members of the room
    memberList() {
        const names: string[] = [];

        for (let member of this.members) {
            names.push(member.name);
        }

        return ({type: "members", names});
    }
}
