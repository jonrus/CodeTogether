import Room from "../Room";
import RoomMember from "../RoomMember";

describe("Room Class Tests", () => {
    test("Ensure default room is created", () => {
        expect(Room.isRoomNameActive("TestingRoom")).toBeTruthy();
    });

    test("Ensure auto room names are a string", () => {
        const name = Room.newRoomName();
        expect(name).toEqual(expect.any(String));
    });

    test("Create a new room", () => {
        //Create a room by asking for a room not yet created
        expect(Room.get("TestRoom01")).toBeTruthy();
        //Test we can check if inuse by name
        expect(Room.isRoomNameActive("TestRoom01")).toBeTruthy();
    });

    test("Returns empty member list for empty room", () => {
        const testRoom = Room.get("TestRoom01");
        expect(testRoom.memberList()).toEqual({type: "members", names: []});
    });

    test("Join member to room, get valid member list - member leaves, get valid member list", () => {
        //Create a test member
        const member = new RoomMember(() => null, "TestRoom01");
        //Set the username and join the room
        member.handleJoin("TestMember01");

        const testRoom = Room.get("TestRoom01");
        expect(testRoom.memberList()).toEqual({type: "members", names: [{name: "TestMember01", color: expect.any(String)}]});
        
        //Remove the member from the room
        testRoom.leave(member);

        //Check that member is removed from list
        expect(testRoom.memberList()).toEqual({type: "members", names: []});
    });

    test("ensure isNameInUse functions", () => {
        //Create a test member
        const member = new RoomMember(() => null, "TestRoom01")
        //Set the username and join the room
        member.handleJoin("TestMember01");
        
        //Check for a name is use
        expect(Room.isNameInUse("TestRoom01", "TestMember01")).toBeTruthy();
        //Check for a name NOT in use
        expect(Room.isNameInUse("TestRoom01", "NewName")).toBeFalsy();

        //Remove the member from the room
        const testRoom = Room.get("TestRoom01");
        testRoom.leave(member);
    });

    test("Ensure room is removed once the last member leaves", () => {
        //Create room, member and join the room
        const testRoom = Room.get("TestRoom02");
        const member = new RoomMember(() => null, "TestRoom02");
        member.handleJoin("TestMember01");

        //Ensure room is active
        expect(Room.isRoomNameActive("TestRoom02")).toBeTruthy();
        
        //Leave room
        testRoom.leave(member);
        
        //Ensure room is inactive
        expect(Room.isRoomNameActive("TestRoom02")).toBeFalsy();
    });

    test("Ensure deafult testing room is not removed when last member leaves", () => {
        //Create room, member and join the room
        const testRoom = Room.get("TestingRoom");
        const member = new RoomMember(() => null, "TestingRoom");
        member.handleJoin("TestMember01");

        //Ensure room is active
        expect(Room.isRoomNameActive("TestingRoom")).toBeTruthy();
        
        //Leave room
        testRoom.leave(member);
        
        //Ensure room is inactive
        expect(Room.isRoomNameActive("TestingRoom")).toBeTruthy();
    });
});
