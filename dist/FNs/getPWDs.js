"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const index_2 = require("../index");
const getPasswords = async (req, res) => {
    try {
        const usernames = req.body;
        if (!usernames) {
            res.status(400).send("Username is required.");
            return;
        }
        const promises = usernames.map(async (username) => {
            const prefix = `password:${username}`;
            const storedPassword = await index_2.client.get(prefix);
            return { username, storedPassword };
        });
        const result = await Promise.all(promises);
        console.log(result);
        res.send(result);
    }
    catch (error) {
        (0, index_1.handleRedisError)(error, res);
    }
};
exports.default = getPasswords;
