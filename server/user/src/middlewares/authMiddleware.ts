import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import type { IUser } from "../model/userModel.js";

export interface AuthRequest extends Request {
  user?: Partial<IUser>;
}

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
    ) as unknown as DecodedToken;

    req.user = {
      _id: new Types.ObjectId(decoded.id),
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};