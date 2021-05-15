import RoomMember from "./RoomMember";
/*
    Room class used to session rooms
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
    members: Set<RoomMember>; //!Determine type/interface for members
    constructor(roomID: string) {
        this.id = roomID;
        this.members = new Set();
    }

    //Add a member to the room
    join(member: RoomMember) { //!
        this.members.add(member);
        this.broadcast(this.memberList());
    }

    //Remove a member from the room
    leave(member: RoomMember) { //!
        this.members.delete(member);
        this.broadcast(this.memberList());
    }

    //Send message to all memebers of the room
    broadcast(data: unknown) { //!Detrmine data type/interface
        for (let mem of this.members) {
            mem.send(JSON.stringify(data));
        }
    }

    //Create a JSON object to send to out all members of the room
    memberList() {
        const mems: string[] = [];

        for (let member of this.members) {
            mems.push(member.name);
        }

        return ({type: "members", names: mems});
    }
}
