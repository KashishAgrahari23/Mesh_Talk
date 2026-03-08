import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createNewChat } from "../controllers/chatController.js";

const router = express.Router()

router.post("/chat" , authMiddleware , createNewChat)

export default router