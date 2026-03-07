import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createClient } from "redis";
import connectDB from "./config/db.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import loginRoute from "./routes/userRoutes.js"
import cors from "cors"
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors())
connectDB();
connectRabbitMQ()
export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
}); //redis setup

redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch((error) => console.error(error));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/v1",loginRoute)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
