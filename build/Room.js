"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("@codemirror/state");
/*
    Room class used to manage room, members and document changes
*/
const currentRooms = new Map();
class Room {
    constructor(roomID) {
        this.docUpdates = [];
        this.id = roomID;
        this.docUpdates = [];
        this.doc = state_1.Text.of([""]);
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
        for (let mem of this.members) {
            const data = JSON.stringify({
                type: "editor-Changes",
                changes: this.docUpdates.slice(mem.docVersion)
            });
            mem.send(data);
        }
    }
    //Create a JSON object to send to out all members of the room
    memberList() {
        const names = [];
        for (let member of this.members) {
            names.push(member.name);
        }
        return ({ type: "members", names });
    }
}
exports.default = Room;
