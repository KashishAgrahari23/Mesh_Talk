import axios from "axios";
import { TryCatch } from "../config/TryCatch.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { Chat } from "../models/chatModel.js";
import { Messages } from "../models/messageModel.js";
import { getRecieverSocketId } from "../config/socket.js";
import { io } from "../config/socket.js"

export const createNewChat = TryCatch(async (req: AuthRequest, res) => {
  const userId = req.user?._id;
  const { otherUserId } = req.body;
  if (!otherUserId) {
    res.status(400).json({
      message: "other user id is required",
    });
    return;
  }

  const existingChat = await Chat.findOne({
    users: { $all: [userId, otherUserId], $size: 2 },
  });

  if (existingChat) {
    res.json({
      message: "chat already exist",
      chatId: existingChat._id,
    });
    return;
  }

  const newChat = await Chat.create({
    users: [userId, otherUserId],
  });

  res.status(201).json({
    message: "New Chat created",
    chatId: newChat._id,
  });
});

export const getAllChats = TryCatch(async (req: AuthRequest, res) => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(400).json({
      message: "user id is required",
    });
    return;
  }
  const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });
  const userData = await Promise.all(
    chats.map(async (chat) => {
      const otherUserId = chat.users.find((id) => id !== userId);
      const unseenCount = await Messages.countDocuments({
        chatId: chat._id,
        sender: { $ne: userId },
        seen: false,
      });
      try {
        const url = `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`;
        // console.log("Calling user service:", url);
        // console.log("env variable: ", process.env.USER_SERVICE);
        const { data } = await axios.get(url);
        return {
          user: data.user,
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenCount,
          },
        };
      } catch (error) {
        console.log(error);
        return {
          user: {
            _id: otherUserId,
            name: "Unknown User",
          },
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenCount,
          },
        };
      }
    }),
  );
  res.json({
    chats: userData,
  });
});

export const sendMessage = TryCatch(async (req: AuthRequest, res) => {
  const senderId = req.user?._id
  const { chatId, text } = req.body
  const imageFile = req.file

  if (!senderId) {
    return res.status(401).json({ message: "unauthorized" })
  }

  if (!chatId) {
    return res.status(400).json({ message: "chat id required" })
  }

  if (!text && !imageFile) {
    return res.status(400).json({
      message: "either text or image is required",
    })
  }

  const chat = await Chat.findById(chatId)
  if (!chat) {
    return res.status(404).json({ message: "chat not found" })
  }

  const isUserInChat = chat.users.some(
    (userId) => userId.toString() === senderId.toString()
  )

  if (!isUserInChat) {
    return res.status(403).json({
      message: "you are not a participant",
    })
  }

  const otherUserId = chat.users.find(
    (id) => id.toString() !== senderId.toString()
  )

  if (!otherUserId) {
    return res.status(400).json({ message: "no other user" })
  }

  let isReceiverInChatRoom = false

  const receiverSocketId = getRecieverSocketId(otherUserId.toString())

  if (receiverSocketId) {
    const receiverSocket = io.sockets.sockets.get(receiverSocketId)

    if (receiverSocket?.rooms.has(chatId)) { 
      isReceiverInChatRoom = true
    }
  }

  let msjData: any = {
    chatId,
    sender: senderId,
    seen: isReceiverInChatRoom,
    seenAt: isReceiverInChatRoom ? new Date() : undefined,
  }

  if (imageFile) {
    msjData.image = {
      url: imageFile.path,
      publicId: imageFile.filename,
    }
    msjData.messageType = "image"
    msjData.text = text || ""
  } else {
    msjData.messageType = "text"
    msjData.text = text
  }

  const message = new Messages(msjData)
  const savedMsj = await message.save()

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: {
      text: imageFile ? "image" : text,
      sender: senderId,
    },
    updatedAt: new Date(),
  })

  io.to(chatId).emit("newMessage", savedMsj)

  if (!isReceiverInChatRoom && receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", savedMsj)
  }

  res.status(201).json({
    message: savedMsj,
    sender: senderId,
  })
})
export const getMessagesByChat = TryCatch(async (req: AuthRequest, res) => {
  const userId = req.user?._id;
  const { chatId } = req.params;
  console.log(userId)
  console.log("chatId:- ",chatId)
  if (!userId) {
    res.status(400).json({
      message: "User id is required",
    });
    return;
  }
  if (!chatId) {
    res.status(400).json({
      message: "Chat id is required",
    });
    return;
  }
  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404).json({
      message: "chat not found",
    });
    return;
  }
  const isUserInChat = chat.users.some(
    (id) => id.toString() === userId.toString(),
  );
  if (!isUserInChat) {
    res.status(403).json({
      message: "you are not a participant of this chat",
    });
    return;
  }
  const messagesToMarkSeen = await Messages.find({
    chatId: chatId,
    sender: { $ne: userId },
    seen: false,
  });
  await Messages.updateMany(
    {
      chatId: chatId,
      sender: { $ne: userId },
      seen: false,
    },
    {
      seen: true,
      seenAt: new Date(),
    },
  );

  const messages = await Messages.find({ chatId }).sort({ createdAt: 1 });
  const otherUserId = chat.users.find((id) => id.toString() !== userId.toString());
  if (!otherUserId) {
    res.status(403).json({
      message: "no other user",
    });
    return
  }
  try {
    const url = `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`;
    // console.log("Calling user service:", url);
    // console.log("env variable: ", process.env.USER_SERVICE);
    const { data } = await axios.get(url);
    

res.status(200).json({
      messages,
      user:data.user
    }); 
} catch (error) {
    console.log(error)
    res.json({
        messages,
        user:{
            _id: otherUserId,
            name:"Unknown User"
        }
    })
  }
});
