import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createClient } from "redis";
import connectDB from "./config/db.js";
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
connectDB();

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch((error) => console.error(error));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
