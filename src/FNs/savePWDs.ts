import { handleRedisError } from "../index";
import { client } from "../index";
import { Request, Response } from "express";
const savePasswords = (req: Request, res: Response) => {
  try {
    const users = req.body;
    users.map(async (pair: { username: string; password: string }) => {
      console.log(pair);
      const { username, password } = pair;
      if (!username || !password)
        throw new Error("Both username and password are required.");

      const prefix = `password:${username}`;

      const result = await client.set(prefix, String(password));
      console.log(`Password for ${username} saved ${result}.`);
    });
    res.send("Password saved successfully.");
  } catch (error) {
    handleRedisError(error, res);
  }
};
export default savePasswords;
