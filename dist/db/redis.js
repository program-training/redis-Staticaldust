"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const chalk_1 = __importDefault(require("chalk"));
const app = (0, express_1.default)();
const dotenv_1 = require("dotenv");
const EXPRESS_PORT = 6000;
(0, dotenv_1.config)();
const client = (0, redis_1.createClient)();
app.listen(EXPRESS_PORT, () => {
    console.log(chalk_1.default.blueBright(`listening on: ${EXPRESS_PORT}`));
    client
        .connect()
        .then(() => console.log(chalk_1.default.magentaBright("connected successfully to Redis client!!! ")))
        .catch((error) => {
        if (error instanceof Error)
            console.log(error.message);
    });
});
