"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const index_2 = require("../index");
const getPassword = async (req, res) => {
    const { username } = req.query;
    if (!username) {
        res.status(400).send("Username is required.");
        return;
    }
    const prefix = `password:${username}`;
    try {
        const storedPassword = await index_2.client.get(prefix);
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
        (0, index_1.handleRedisError)(error, res);
    }
};
exports.default = getPassword;
