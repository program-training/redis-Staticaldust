import express, { Request, Response } from "express";
import { createClient } from "redis";
import chalk from "chalk";
import { config } from "dotenv";
import savePassword from "./FNs/savePWD";
import getPassword from "./FNs/getPWD";
import savePasswords from "./FNs/savePWDs";
import getPasswords from "./FNs/getPWDs";
import getAllPasswords from "./FNs/getAllPWDs";
import jsonSavePassword from "./FNs/jsonSavePWD";

config();
const app = express();

const PORT = 6000;

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
export const client = createClient();

export const handleRedisError = (error: unknown, res: Response): void => {
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
app.post("/save-passwords", savePasswords);
app.post("/get-passwords", getPasswords);
app.get("/get-all-passwords", getAllPasswords);
app.post("/json-save-password", jsonSavePassword);
