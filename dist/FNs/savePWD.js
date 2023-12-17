"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const index_2 = require("../index");
const savePassword = async (req, res) => {
    const { username, password } = req.query;
    if (!username || !password) {
        res.status(400).send("Both username and password are required.");
        return;
    }
    const prefix = `password:${username}`;
    try {
        await index_2.client.set(prefix, String(password));
        const incrResult = await index_2.client.incr("password_count");
        console.log(`There are ${incrResult} users!`);
        console.log(`Password for ${username} saved successfully.`);
        res.send("Password saved successfully.");
    }
    catch (error) {
        (0, index_1.handleRedisError)(error, res);
    }
};
exports.default = savePassword;
