"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    Room class used to session rooms
*/
const currentRooms = new Map();
class Room {
    constructor(roomID) {
        this.id = roomID;
        this.members = new Set();
    }
    //Static method to get room, or add it to the map if it doesn't exist
    static get(roomID) {
        if (!currentRooms.has(roomID)) {
            currentRooms.set(roomID, new Room(roomID));
        }
        return currentRooms.get(roomID);
    }
    //Add a member to the room
    join(member) {
        this.members.add(member);
        this.broadcast(this.memberList());
    }
    //Remove a member from the room
    leave(member) {
        this.members.delete(member);
        this.broadcast(this.memberList());
    }
    //Send message to all memebers of the room
    broadcast(data) {
        for (let mem of this.members) {
            mem.send(JSON.stringify(data));
        }
    }
    //Create a JSON object to send to out all members of the room
    memberList() {
        const mems = [];
        for (let member of this.members) {
            mems.push(member.name);
        }
        return ({ type: "members", names: mems });
    }
}
exports.default = Room;
