"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRedisError = exports.client = void 0;
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = require("dotenv");
const savePWD_1 = __importDefault(require("./FNs/savePWD"));
const getPWD_1 = __importDefault(require("./FNs/getPWD"));
const savePWDs_1 = __importDefault(require("./FNs/savePWDs"));
const getPWDs_1 = __importDefault(require("./FNs/getPWDs"));
const getAllPWDs_1 = __importDefault(require("./FNs/getAllPWDs"));
const jsonSavePWD_1 = __importDefault(require("./FNs/jsonSavePWD"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = 6000;
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log(chalk_1.default.blueBright(`listening on: ${PORT}`));
    exports.client
        .connect()
        .then(() => console.log(chalk_1.default.magentaBright("connected successfully to Redis client!!! ")))
        .catch((error) => {
        if (error instanceof Error)
            console.log(error.message);
    });
});
exports.client = (0, redis_1.createClient)();
const handleRedisError = (error, res) => {
    if (error instanceof Error) {
        console.log(`Redis Error: ${error.message}`);
        res.status(500).send(`Redis Error: ${error.message}`);
    }
    else {
        console.log(`Unexpected Redis Error: ${error}`);
        res.status(500).send(`Unexpected Redis Error: ${error}`);
    }
};
exports.handleRedisError = handleRedisError;
app.get("/save-password", savePWD_1.default);
app.get("/get-password", getPWD_1.default);
app.post("/save-passwords", savePWDs_1.default);
app.post("/get-passwords", getPWDs_1.default);
app.get("/get-all-passwords", getAllPWDs_1.default);
app.post("/json-save-password", jsonSavePWD_1.default);
