import express, { Request, Response } from "express";
import { createClient } from "redis";
// import RedisJSON from "redis-json";
import chalk from "chalk";
import { config } from "dotenv";
config();
// import savePassword from "./FNs/savePWD";

const app = express();

const PORT = 6000;
const client = createClient();

app.use(express.json());

app.listen(PORT, () => {
  console.log(chalk.blueBright(`listening on: ${PORT}`));
  client
    .connect()
    .then(() =>
      console.log(
        chalk.magentaBright("connected successfully to Redis client!!! ")
      )
    )
    .catch((error) => {
      if (error instanceof Error) console.log(error.message);
    });
});

async function savePassword(req: Request, res: Response) {
  const { username, password } = req.query as {
    username?: string;
    password?: string;
  };
  if (!username || !password) {
    res.status(400).send("Both username and password are required.");
    return;
  }

  const key = `password:${username}`;
  try {
    await client.set(key, String(password));
    const incrResult = await client.incr("password_count");
    console.log(`There are ${incrResult} users!`);
    console.log(`Password for ${username} saved successfully.`);
    res.send("Password saved successfully.");
  } catch (error) {
    handleRedisError(error, res);
  }
}

const getPassword = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.query as { username?: string };
  if (!username) {
    res.status(400).send("Username is required.");
    return;
  }

  const key = `password:${username}`;
  try {
    const storedPassword = await client.get(key);
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

const handleRedisError = (error: unknown, res: Response): void => {
  if (error instanceof Error) {
    console.log(`Redis Error: ${error.message}`);
    res.status(500).send(`Redis Error: ${error.message}`);
  } else {
    console.log(`Unexpected Redis Error: ${error}`);
    res.status(500).send(`Unexpected Redis Error: ${error}`);
  }
};

const savePasswords = (req: Request, res: Response) => {
  try {
    const users = req.body;
    users.map(async (pair: { username: string; password: string }) => {
      console.log(pair);
      const { username, password } = pair;
      if (!username || !password)
        throw new Error("Both username and password are required.");

      const key = `password:${username}`;

      const result = await client.set(key, String(password));
      console.log(`Password for ${username} saved ${result}.`);
    });
    res.send("Password saved successfully.");
  } catch (error) {
    handleRedisError(error, res);
  }
};

const getPasswords = async (req: Request, res: Response): Promise<void> => {
  try {
    const usernames = req.body;
    if (!usernames) {
      res.status(400).send("Username is required.");
      return;
    }

    const promises = usernames.map(async (username: string) => {
      const key = `password:${username}`;
      const storedPassword = await client.get(key);
      return { username, storedPassword };
    });
    const result = await Promise.all(promises);
    console.log(result);
    res.send(result);
  } catch (error) {
    handleRedisError(error, res);
  }
};

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

// const redisJSON = new RedisJSON(client);

// const saveJSONToRedis = async (key: string, value: object): Promise<void> => {
//   try {
//     await redisJSON.set(key, '.', value);
//     console.log(`Key-value pair saved successfully. Key: ${key}, Value: ${JSON.stringify(value)}`);
//   } catch (error) {
//     console.error(`Error saving key-value pair to Redis: ${error}`);
//   }
// };

// const key = "exampleKey";
// const value = { name: "John", age: 30, city: "ExampleCity" };
// saveJSONToRedis(key, value);
app.get("/save-password", savePassword);
app.get("/get-password", getPassword);
app.post("/save-passwords", savePasswords);
app.post("/get-passwords", getPasswords);
app.get("/get-all-passwords", getAllPasswords);
