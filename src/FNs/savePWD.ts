import { handleRedisError } from "../index";
import { client } from "../index";
import { Request, Response } from "express";


const savePassword = async (req: Request, res: Response) => {
    const { username, password } = req.query as {
      username?: string;
      password?: string;
    };
    if (!username || !password) {
      res.status(400).send("Both username and password are required.");
      return;
    }
  
    const prefix = `password:${username}`;
    try {
      await client.set(prefix, String(password));
      const incrResult = await client.incr("password_count");
      console.log(`There are ${incrResult} users!`);
      console.log(`Password for ${username} saved successfully.`);
      res.send("Password saved successfully.");
    } catch (error) {
      handleRedisError(error, res);
    }
  };
  export default savePassword
  