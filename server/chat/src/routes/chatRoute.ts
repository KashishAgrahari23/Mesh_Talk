import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createNewChat, getAllChats } from "../controllers/chatController.js";

const router = express.Router()

router.post("/chat" , authMiddleware , createNewChat)
router.get("/chats" , authMiddleware , getAllChats)

export default router