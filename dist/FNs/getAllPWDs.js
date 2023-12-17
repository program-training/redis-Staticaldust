"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const index_2 = require("../index");
const getAllPasswords = async (req, res) => {
    try {
        const keys = await index_2.client.keys("password:*");
        const promises = keys.map(async (key) => {
            const username = key.replace("password:", "");
            const storedPassword = await index_2.client.get(key);
            return { [username]: storedPassword };
        });
        const result = await Promise.all(promises);
        const passwordObject = result.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        console.log(passwordObject);
        res.send(passwordObject);
    }
    catch (error) {
        (0, index_1.handleRedisError)(error, res);
    }
};
exports.default = getAllPasswords;
