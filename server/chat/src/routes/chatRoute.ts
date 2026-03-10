import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createNewChat, getAllChats, sendMessage } from "../controllers/chatController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router()

router.post("/chat" , authMiddleware , createNewChat)
router.post("/message" , authMiddleware , upload.single("image") , sendMessage )
router.get("/chats" , authMiddleware , getAllChats)

export default router 