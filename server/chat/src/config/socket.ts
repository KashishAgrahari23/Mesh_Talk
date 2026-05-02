import { Server, Socket } from "socket.io"
import express from "express"
import http from "http"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

const userSocketMap: Record<string, string> = {}

export const getRecieverSocketId = (recieverId: string) : string | undefined =>{
  return userSocketMap[recieverId]
}

io.on("connection", (socket: Socket) => {
  console.log("User Connected", socket.id)

  const userId = socket.handshake.query.userId as string | undefined

  if (userId) {
    userSocketMap[userId] = socket.id
    console.log(`User ${userId} mapped to socket ${socket.id}`)
  }

  io.emit("onlineUsers", Object.keys(userSocketMap))

  // 🔥 join personal room
  if (userId) {
    socket.join(userId)
  }

  // 🔥 join chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId)
    console.log(`User ${userId} joined chat ${chatId}`)
  })

  // 🔥 leave chat room (FIXED)
  socket.on("leaveChat", (chatId) => {
    socket.leave(chatId)   // ✅ FIX
    console.log(`User ${userId} left chat ${chatId}`)
  })

  // 🔥 typing
  socket.on("typing", ({ chatId, userId }) => {
    console.log("typing:", chatId)
    socket.to(chatId).emit("userTyping", { chatId, userId })
  })

  socket.on("stopTyping", ({ chatId, userId }) => {
    socket.to(chatId).emit("userStoppedTyping", { chatId, userId })
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id)

    if (userId) {
      delete userSocketMap[userId]
    }

    io.emit("onlineUsers", Object.keys(userSocketMap))
  })
})

export { app, server, io }
