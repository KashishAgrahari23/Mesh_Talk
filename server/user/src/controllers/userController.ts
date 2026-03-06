import { publishToQueue } from "../config/rabbitmq.js";
import { TryCatch } from "../config/TryCatch.js";
import { redisClient } from "../index.js";

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