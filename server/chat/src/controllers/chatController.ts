import axios from "axios";
import { TryCatch } from "../config/TryCatch.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { Chat } from "../models/chatModel.js";
import { Messages } from "../models/messageModel.js";

export const createNewChat = TryCatch(async(req:AuthRequest , res)=>{
    const userId = req.user?._id
    const {otherUserId} = req.body
    if(!otherUserId){
        res.status(400).json({
            message:"other user id is required"
        })
        return
    }

    const existingChat = await Chat.findOne({
        users:{$all:[userId , otherUserId] , $size:2}
    })

    if (existingChat){
        res.json({
            message:"chat already exist",
            chatId:existingChat._id,
        })
        return
    }

    const newChat = await Chat.create({
        users:[userId , otherUserId]
    })

    res.status(201).json({
            message:"New Chat created",
            chatId:newChat._id,
            
        })
})

export const getAllChats = TryCatch(async(req:AuthRequest , res)=>{
    const userId = req.user?._id
    if(!userId){
        res.status(400).json({
            message:"user id is required"
        })
        return
    }
    const chats = await Chat.find({users:userId}).sort({updatedAt:-1})
    const userData = await Promise.all(
        chats.map(async(chat)=>{
            const otherUserId = chat.users.find((id)=>id!== userId )
            const unseenCount = await Messages.countDocuments({
                chatId:chat._id,
                sender:{$ne:userId},
                seen:false
            })
            try {

                const url = `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`
                console.log("Calling user service:", url)
                console.log("env variable: " , process.env.USER_SERVICE)
                const { data } = await axios.get(url)  
                return {
                    user:data.user,
                    chat:{
                        ...chat.toObject(),
                        latestMessage: chat.latestMessage || null,
                        unseenCount
                    }
                }
            } catch (error) {
                console.log(error)
                return {
                    user:{
                        _id: otherUserId ,
                        name: "Unknown User"
                    },
                    chat:{
                        ...chat.toObject(),
                        latestMessage: chat.latestMessage || null,
                        unseenCount
                    }
                }
            }
            
        })
    )
    res.json({
        chats: userData
    })
})