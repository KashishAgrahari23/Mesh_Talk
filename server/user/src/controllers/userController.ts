import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { TryCatch } from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { User } from "../model/userModel.js";
// kind of producer file to rabbitmq
export const loginUser = TryCatch(async(req,res)=>{
    const {email} = req.body
    const rateLimitKey = `otp:ratelimit:${email}`
    const rateLimit = await redisClient.get(rateLimitKey)
    if(rateLimit){
        res.status(429).json({
            message:"too many request , please wait for sometime"
        })
    }

    const otp = Math.floor(100000 + Math.random()*900000).toString()
    const otpKey = `otp:${email}`
    await redisClient.set(otpKey,otp,{
        EX:300,
    })

    await redisClient.set(rateLimitKey,"true",{
        EX:60,
    })

    const message={
        email:email,
        otp:otp,
        subject:"your otp code",
        body:`your otp is ${otp} , valid for 5 min`,
    } 

    await publishToQueue("send-otp" , message)
    res.status(200).json({message:"otp send successfully"})
}) 

export const verifyUser = TryCatch(async(req,res)=>{
    const {email , otp:enteredOtp} = req.body

    if(!email || !enteredOtp){
        res.status(400).json({message:"email and otp are required"})
        return
    }

    const otpKey = `otp:${email}`
    const storedOtp = await redisClient.get(otpKey)

    if(!storedOtp || storedOtp !== enteredOtp){
        res.status(400).json({message:"invalid otp or expired otp"})
        return
    }

    await redisClient.del(otpKey)
    let user = await User.findOne({email})
    if(!user){
        const name = email.slice(0,8)
        user = await User.create({name , email})
    }

    const token = generateToken(user)
    res.status(200).json({message:"user verified",user , token})
})

export const myProfile = TryCatch(async(req:AuthRequest,res)=>{
    const user = req.user
    res.json(user)
})

export const updateName = TryCatch (async(req:AuthRequest , res)=>{
    const id = req.user?._id
    const user = await User.findById(id)
    if(!user){
        res.status(400).json({message:"please login"})
        return
    }
    user.name = req.body
    await user.save()
    const token = generateToken(user)
    res.json({
        message:"user updated successfully ",
        user,
        token
    }) 
})