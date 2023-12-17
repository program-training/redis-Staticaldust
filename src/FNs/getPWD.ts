import { handleRedisError } from "../index";
import { client } from "../index";
import { Request, Response } from "express";
const getPassword = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.query as { username?: string };
  if (!username) {
    res.status(400).send("Username is required.");
    return;
  }

  const prefix = `password:${username}`;
  try {
    const storedPassword = await client.get(prefix);
    if (storedPassword) {
      console.log(`Password for ${username}: ${storedPassword}`);
      res.send(`Password for ${username}: ${storedPassword}`);
    } else {
      console.log(`Password for ${username} not found.`);
      res.status(404).send(`Password for ${username} not found.`);
    }
  } catch (error) {
    handleRedisError(error, res);
  }
};
export default getPassword;
