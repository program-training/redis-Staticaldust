import express, { Request, Response } from "express";
import { createClient } from "redis";
import chalk from "chalk";
import { config } from "dotenv";
config();

const app = express();
const EXPRESS_PORT = 6000;
const client = createClient();

app.use(express.json());

app.listen(EXPRESS_PORT, () => {
  console.log(chalk.blueBright(`listening on: ${EXPRESS_PORT}`));
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

const savePassword = async (req: Request, res: Response) => {
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
    console.log(`Password for ${username} saved successfully.`);
    res.send("Password saved successfully.");
  } catch (error) {
    handleRedisError(error, res);
  }
};

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

app.get("/save-password", savePassword);
app.get("/get-password", getPassword);
