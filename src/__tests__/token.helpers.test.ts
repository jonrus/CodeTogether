import * as token from "../helpers/token";

describe("Helpers - Token Tests", () => {
    test("Ensure returned token is a string", () => {
        const newToken = token.makeJWT("TestUser");
        expect(newToken).toEqual(expect.any(String));
    });
    test("Ensure token decodes correctly", () => {
        const newToken = token.makeJWT("TestUser");
        expect(token.checkJWT(newToken)).toBeTruthy();
    });
    test("Ensure token fails check with incorrect SECRET_KEY", () => {
        //Token with incorrect secret_key;
        const shouldFail = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlc3RVc2VyIiwiaWF0IjoxNjIzMjY1OTIwLCJleHAiOjE2MjMzMDkxMjB9.eK0WuQShqD6rmHQap-VwBah_04fmIA-dYamkanOoFJ0";
        expect(token.checkJWT(shouldFail)).toBeFalsy();
    });
});
