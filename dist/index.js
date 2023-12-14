"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
// import RedisJSON from "redis-json";
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// import savePassword from "./FNs/savePWD";
const app = (0, express_1.default)();
const PORT = 6000;
const client = (0, redis_1.createClient)();
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log(chalk_1.default.blueBright(`listening on: ${PORT}`));
    client
        .connect()
        .then(() => console.log(chalk_1.default.magentaBright("connected successfully to Redis client!!! ")))
        .catch((error) => {
        if (error instanceof Error)
            console.log(error.message);
    });
});
async function savePassword(req, res) {
    const { username, password } = req.query;
    if (!username || !password) {
        res.status(400).send("Both username and password are required.");
        return;
    }
    const key = `password:${username}`;
    try {
        await client.set(key, String(password));
        const incrResult = await client.incr("password_count");
        console.log(`There are ${incrResult} users!`);
        console.log(`Password for ${username} saved successfully.`);
        res.send("Password saved successfully.");
    }
    catch (error) {
        handleRedisError(error, res);
    }
}
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
const savePasswords = (req, res) => {
    try {
        const users = req.body;
        users.map(async (pair) => {
            console.log(pair);
            const { username, password } = pair;
            if (!username || !password)
                throw new Error("Both username and password are required.");
            const key = `password:${username}`;
            const result = await client.set(key, String(password));
            console.log(`Password for ${username} saved ${result}.`);
        });
        res.send("Password saved successfully.");
    }
    catch (error) {
        handleRedisError(error, res);
    }
};
const getPasswords = async (req, res) => {
    try {
        const usernames = req.body;
        if (!usernames) {
            res.status(400).send("Username is required.");
            return;
        }
        const promises = usernames.map(async (username) => {
            const key = `password:${username}`;
            const storedPassword = await client.get(key);
            return { username, storedPassword };
        });
        const result = await Promise.all(promises);
        console.log(result);
        res.send(result);
    }
    catch (error) {
        handleRedisError(error, res);
    }
};
const getAllPasswords = async (req, res) => {
    try {
        const keys = await client.keys("password:*");
        const promises = keys.map(async (key) => {
            const username = key.replace("password:", "");
            const storedPassword = await client.get(key);
            return { [username]: storedPassword };
        });
        const result = await Promise.all(promises);
        const passwordObject = result.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        console.log(passwordObject);
        res.send(passwordObject);
    }
    catch (error) {
        handleRedisError(error, res);
    }
};
// const redisJSON = new RedisJSON(client);
// const saveJSONToRedis = async (key: string, value: object): Promise<void> => {
//   try {
//     await redisJSON.set(key, '.', value);
//     console.log(`Key-value pair saved successfully. Key: ${key}, Value: ${JSON.stringify(value)}`);
//   } catch (error) {
//     console.error(`Error saving key-value pair to Redis: ${error}`);
//   }
// };
// const key = "exampleKey";
// const value = { name: "John", age: 30, city: "ExampleCity" };
// saveJSONToRedis(key, value);
app.get("/save-password", savePassword);
app.get("/get-password", getPassword);
app.post("/save-passwords", savePasswords);
app.post("/get-passwords", getPasswords);
app.get("/get-all-passwords", getAllPasswords);
