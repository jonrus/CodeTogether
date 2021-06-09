//Set env vars with testing values
process.env.NODE_ENV = "test";
process.env.SECRET_KEY = "testing";

//Import after vars are set
import * as config from "../config";

describe("Config Tests", () => {
    //Ensure vars are set
    test("NODE_ENV is 'test'", () => {
        expect(process.env.NODE_ENV).toEqual("test");
    });

    //Test vars coming back from config
    test("SECRET_KEY is set", () => {
        expect(config.SECRET_KEY).toEqual("testing");
    });

    test("BCRYPT_WF is set", () => {
        expect(config.BCRYPT_WF).toEqual(1);
    });

    test("PORT is set", () => {
        expect(config.PORT).toEqual(3001);
    });

    test("DATABASE_URL is set", () => {
        const dbURL = config.getDatabaseUri();
        expect(dbURL).toEqual("collabtext_test");
    });
});
