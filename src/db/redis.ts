import express from "express";
import { createClient } from "redis";
import chalk from "chalk";
const app = express();
import { config } from "dotenv";
const EXPRESS_PORT = 6000
config();

const client = createClient();

app.listen(EXPRESS_PORT, () => {
  console.log(
    chalk.blueBright(`listening on: ${EXPRESS_PORT}`)
  );
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
