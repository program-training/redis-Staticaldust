"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const index_2 = require("../index");
const savePasswords = (req, res) => {
    try {
        const users = req.body;
        users.map(async (pair) => {
            console.log(pair);
            const { username, password } = pair;
            if (!username || !password)
                throw new Error("Both username and password are required.");
            const prefix = `password:${username}`;
            const result = await index_2.client.set(prefix, String(password));
            console.log(`Password for ${username} saved ${result}.`);
        });
        res.send("Password saved successfully.");
    }
    catch (error) {
        (0, index_1.handleRedisError)(error, res);
    }
};
exports.default = savePasswords;
