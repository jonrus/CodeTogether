import RoomMember from "./RoomMember";
import {generateSlug, RandomWordOptions} from "random-word-slugs";
import {Text} from "@codemirror/state";
import {Update} from "@codemirror/collab";
/*
    Room class used to manage room, members and document changes
*/

const currentRooms = new Map();
const roomNameOptions: RandomWordOptions<4> = {
    format: "kebab"
}

export default class Room {
    //Static method to get room, or add it to the map if it doesn't exist
    static get(roomID: string) {
        if (!currentRooms.has(roomID)) {
            currentRooms.set(roomID, new Room(roomID));
        }

        return currentRooms.get(roomID);
    }
    static isRoomNameActive(roomID: string) {
        return currentRooms.has(roomID);
    }
    static newRoomName() {
        let name = generateSlug(4, roomNameOptions);
        while (Room.isRoomNameActive(name)) {
            name = generateSlug(4, roomNameOptions);
        }
        return name;
    }
    static isNameInUse(roomID: string, name: string) {
        //This does not do as much checking as it should
        //If a guest user joins a room and then a registered/signed in user
        //tries to join the same room, they will get a message (frontend) that
        //their name is in use... There is no real easy way for a registered 
        //user to change their name. But I think the chances of this happening
        //with the expected userbase (0) to be slim.
        const room = currentRooms.get(roomID);
        if (!room) return false;
        return room.memberNameInUse(name);
    }

    id: string;
    doc: Text;
    docUpdates: Update[] = [];
    members: Set<RoomMember>;
    constructor(roomID: string) {
        this.id = roomID;
        this.docUpdates = [];
        this.doc = Text.of([""]);
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
    broadcast(data: Object) {
        const toSend = JSON.stringify(data);
        for (let mem of this.members) {
            mem.send(toSend);
        }
    }

    /*
        Send changes to all room members, but only changes made after the point
        they joined the room.
        Perhaps it will save on some bandwidth, and processing time for at user?
    */
    broadcastChanges() {
        const cursors = this.memberCursors();
        for (let mem of this.members) {
            const data = JSON.stringify({
                type: "editor-Changes",
                changes: this.docUpdates.slice(mem.docVersion),
                cursors
            });
            mem.send(data);
        }
    }

    //Create a JSON object to send to out all members of the room
    memberList() {
        const names: object[] = [];
        for (let member of this.members) {
            names.push({name: member.name, color: member.color});
        }

        return ({type: "members", names});
    }

    //Create an array containing all room member cursor info
    memberCursors() {
        const mems: object[] = [];
        for (let mem of this.members) {
            mems.push({
                name: mem.name,
                selection: mem.selection,
                color: mem.color
            });
        }

        return mems;
    }

    //Determine if a room has a given username in it
    memberNameInUse(name: string) {
        for (let mem of this.members) {
            if (mem.name === name) return true;
        }
        return false;
        /* const idx = this.memberList().names.indexOf(name);
        if (idx === -1) return false;
        return true; */
    }
}
