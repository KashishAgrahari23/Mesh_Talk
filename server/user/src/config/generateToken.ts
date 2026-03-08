import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
import type { IUser } from '../model/userModel.js';

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string

export const generateToken = (user:IUser)=>{
    return jwt.sign({
        id:user._id,
        email:user.email
    }, JWT_SECRET , {expiresIn:"7d"})
}
