"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const EXPRESS_PORT = 6000;
const client = (0, redis_1.createClient)();
app.use(express_1.default.json());
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
const savePassword = async (req, res) => {
    const { username, password } = req.query;
    if (!username || !password) {
        res.status(400).send("Both username and password are required.");
        return;
    }
    const key = `password:${username}`;
    try {
        await client.set(key, String(password));
        console.log(`Password for ${username} saved successfully.`);
        res.send("Password saved successfully.");
    }
    catch (error) {
        handleRedisError(error, res);
    }
};
const getPassword = async (req, res) => {
    const { username } = req.query;
    if (!username) {
        res.status(400).send("Username is required.");
        return;
    }
    const key = `password:${username}`;
    try {
        const storedPassword = await client.get(key);
        if (storedPassword) {
            console.log(`Password for ${username}: ${storedPassword}`);
            res.send(`Password for ${username}: ${storedPassword}`);
        }
        else {
            console.log(`Password for ${username} not found.`);
            res.status(404).send(`Password for ${username} not found.`);
        }
    }
    catch (error) {
        handleRedisError(error, res);
    }
};
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
app.get("/save-password", savePassword);
app.get("/get-password", getPassword);
