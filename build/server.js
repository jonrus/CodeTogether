"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
app_1.app.listen(config_1.PORT, () => {
    console.log(`Server started: http://127.0.0.1:${config_1.PORT}`);
});
