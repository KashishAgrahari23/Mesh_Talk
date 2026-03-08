import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface IUser {
  _id: string;
  name?: string;
  email: string;
}

interface DecodedToken {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: IUser | null;
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
      res.status(401).json({ message: "Invalid token format" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    req.user = {
      _id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};