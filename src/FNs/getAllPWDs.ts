import { handleRedisError } from "../index";
import { client } from "../index";
import { Request, Response } from "express";
const getAllPasswords = async (req: Request, res: Response): Promise<void> => {
  try {
    const keys = await client.keys("password:*");
    const promises = keys.map(async (key) => {
      const username = key.replace("password:", "");
      const storedPassword = await client.get(key);
      return { [username]: storedPassword };
    });
    const result = await Promise.all(promises);
    const passwordObject = result.reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );
    console.log(passwordObject);
    res.send(passwordObject);
  } catch (error) {
    handleRedisError(error, res);
  }
};
export default getAllPasswords;
