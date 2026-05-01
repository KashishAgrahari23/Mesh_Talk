import {Server , Socket} from "socket.io"
import  express  from "express"
import http from 'http'
const app = express()

const server= http.createServer(app)

const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });

const userSocketMap : Record<string , string> = {}

io.on("connection" , (socket:Socket)=>{
    console.log("User Connected" , socket.id)
    // socket.on("new-user-joined" , (name)=>{
    //     userSocketMap[socket.id] = socket
    //     socket.broadcast.emit("user-joined" , name)
    // })

    const userId = socket.handshake.query.userId as string | undefined
 
    if(userId && userId !== undefined){
        userSocketMap[userId] = socket.id
        console.log(`User ${userId} mapped to socket ${socket.id}`)
    }

    io.emit("onlineUsers" , Object.keys(userSocketMap));
    if(userId){
        socket.join(userId)
    }

    socket.on("typing", (data) => {
        console.log(`User ${data.userId} is typing in chat ${data.chatId}`)
        socket.to(data.chatId).emit("userTyping" , {
            chatId : data.chatId,
            userId : data.userId
        })
    })
    socket.on("stopTyping", (data) => {
        console.log(`User ${data.userId} stopped typing in chat ${data.chatId}`)
        socket.to(data.chatId).emit("userStoppedTyping" , {
            chatId : data.chatId,
            userId : data.userId
        })
    })

    socket.on("joinChat" , (chatId)=>{
        socket.join(chatId)
        console.log(`User ${userId} joined chat room ${chatId}`)
    })
    socket.on("leaveChat" , (chatId)=>{
        socket.join(chatId)
        console.log(`User ${userId} left chat room ${chatId}`)
    })

    socket.on("disconnect" , ()=>{
        console.log("User Disconnected" , socket.id)
        if(userId && userId !== undefined){
            delete userSocketMap[userId]
            console.log(`User ${userId} removed from online users`)
            io.emit("getOnlineUsers" , Object.keys(userSocketMap))
        }
        io.emit("onlineUsers" , Object.keys(userSocketMap))
    })

    socket.on("connect_error" , (err)=>{
        console.log("Socket Connection error",err)
    })
})

export {app,server , io}