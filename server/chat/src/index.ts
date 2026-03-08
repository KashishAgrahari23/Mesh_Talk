import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
const app = express()
dotenv.config()
connectDB()
const PORT = process.env.PORT
app.listen(PORT , ()=>{
    console.log(`server is running on ${PORT}`)
})