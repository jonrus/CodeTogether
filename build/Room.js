"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_word_slugs_1 = require("random-word-slugs");
const state_1 = require("@codemirror/state");
/*
    Room class used to manage room, members and document changes
*/
const currentRooms = new Map(); //Default room created at EOF
const roomNameOptions = {
    format: "kebab"
};
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
    static isRoomNameActive(roomID) {
        return currentRooms.has(roomID);
    }
    static newRoomName() {
        let name = random_word_slugs_1.generateSlug(4, roomNameOptions);
        while (Room.isRoomNameActive(name)) {
            name = random_word_slugs_1.generateSlug(4, roomNameOptions);
        }
        return name;
    }
    static isNameInUse(roomID, name) {
        //This does not do as much checking as it should
        //If a guest user joins a room and then a registered/signed in user
        //tries to join the same room, they will get a message (frontend) that
        //their name is in use... There is no real easy way for a registered 
        //user to change their name. But I think the chances of this happening
        //with the expected userbase (0) to be slim.
        const room = currentRooms.get(roomID);
        if (!room)
            return false;
        return room.memberNameInUse(name);
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
        this.cleanUp();
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
        const names = [];
        for (let member of this.members) {
            names.push({ name: member.name, color: member.color });
        }
        return ({ type: "members", names });
    }
    //Create an array containing all room member cursor info
    memberCursors() {
        const mems = [];
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
    memberNameInUse(name) {
        for (let mem of this.members) {
            if (mem.name === name)
                return true;
        }
        return false;
        /* const idx = this.memberList().names.indexOf(name);
        if (idx === -1) return false;
        return true; */
    }
    //Cleanup code for the room - called when a member leaves
    cleanUp() {
        //Leave the default testing room alone
        //TODO: Decide to clear the document or not.
        if (this.id === "TestingRoom")
            return;
        //Determine if the room is empty and delete it if it is.
        if (this.members.size === 0) {
            currentRooms.delete(this.id);
        }
    }
}
exports.default = Room;
//Create a default testing room
currentRooms.set("TestingRoom", new Room("TestingRoom"));
