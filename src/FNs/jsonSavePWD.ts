import { handleRedisError } from "../index";
import { client } from "../index";
import { Request, Response } from "express";
// import { Request, Response } from "express";
// import redis from "redis";
// import RedisJson from "redis-json";

// const client = redis.createClient();
// const redisJson = new RedisJson(client);

// const handleRedisError = (error: any, res: Response) => {
//   console.error("Redis error:", error);
//   res.status(500).send("Internal Server Error");
// };

// const jsonSavePassword = async (req: Request, res: Response) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     res
//       .status(400)
//       .send("Both username and password are required in the request body.");
//     return;
//   }
//   const prefix = `password:${username}`;
//   try {
//     await redisJson.set(prefix, password);
//     const incrResult = await client.incr("password_count");
//     console.log(`There are ${incrResult} users!`);
//     console.log(`Password for ${username} saved successfully.`);
//     res.send("Password saved successfully.");
//   } catch (error) {
//     handleRedisError(error, res);
//   }
// };

// export default jsonSavePassword;
const jsonSavePassword = async (req: Request, res: Response) => {
    try {
      const { firstname, lastname } = req.body;
  
      if (!firstname || !lastname) {
        throw new Error(
          "Both firstname and lastname are required in the request body."
        );
      }
  
      const key = `${firstname}:${lastname}`;
      const jsonData = { lastname }; // Assuming you want to store only lastname in the JSON object
  
      const prex = await client.json.set(key, "$", jsonData);
  
      const incrResult = await client.incr("password_count");
      console.log(`There are ${incrResult} users!`);
      console.log(`Password for ${key} saved successfully.`);
      res.send("Password saved successfully.");
    } catch (error) {
      handleRedisError(error, res);
    }
  };
  export default jsonSavePassword