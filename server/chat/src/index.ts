import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import ChatRoute from "./routes/chatRoute.js"
const app = express()
dotenv.config()
connectDB()
const PORT = process.env.PORT

app.use("/api/v1" , ChatRoute)

app.listen(PORT , ()=>{
    console.log(`server is running on ${PORT}`)
})