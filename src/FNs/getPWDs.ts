import { handleRedisError } from "../index";
import { client } from "../index";
import { Request, Response } from "express";
const getPasswords = async (req: Request, res: Response): Promise<void> => {
  try {
    const usernames = req.body;
    if (!usernames) {
      res.status(400).send("Username is required.");
      return;
    }

    const promises = usernames.map(async (username: string) => {
      const prefix = `password:${username}`;
      const storedPassword = await client.get(prefix);
      return { username, storedPassword };
    });
    const result = await Promise.all(promises);
    console.log(result);
    res.send(result);
  } catch (error) {
    handleRedisError(error, res);
  }
};
export default getPasswords;
