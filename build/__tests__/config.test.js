"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//Set env vars with testing values
process.env.NODE_ENV = "test";
process.env.SECRET_KEY = "testing";
//Import after vars are set
const config = __importStar(require("../config"));
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
