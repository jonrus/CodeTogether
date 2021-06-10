//Ensure we use the test DB
process.env.NODE_ENV = "test";

import db from "../db";
import User from "../models/User";

describe("User Model/Database Tests", () => {
    beforeEach(async () => {
        //Empty the DB
        await db.query("DELETE FROM users");

        //Create a test user
        await User.register("TestUsername", "PASSWORD");
    });

    test("Ensure User can register", async () => {
        const newUser = await User.register("NewUser", "NewPassword");
        expect(newUser).toEqual({username: "NewUser"});
    });

    test("Ensure ERROR when try to register with a duplicate username", async () => {
        try {
            await User.register("TestUsername", "PASSWORD");
            fail("Was able to register a duplicate username");
        }
        catch (e) {
            expect(e.message).toEqual("Duplicate username");
        }
    });

    test("Ensure User can auth with correct password", async () => {
        const user = await User.auth("TestUsername", "PASSWORD");
        expect(user).toEqual({username: "TestUsername"});
    });

    test("Ensure ERROR when auth with incorrect password", async () => {
        try {
            await User.auth("TestUsername", "WRONGPASSWORD");
            fail("Was able to auth with incorrect password");
        }
        catch (e) {
            expect(e.message).toEqual("Invalid username/password");
        }
    });

    test("Ensure ERROR when auth with unknown username", async () => {
        try {
            await User.auth("NotAUser", "FOOBAR");
            fail("Was able to auth with unknown username");
        }
        catch (e) {
            expect(e.message).toEqual("Invalid username/password");
        }
    });
});

afterAll(async () => {
    await db.end();
});
