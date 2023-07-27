import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import User from "../models/User";
import { ResponseError } from "../types/Error";

dotenv.config();

const JWT_SECRET: Secret = process.env.JWTSECRET!;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");

  try {
    if (!token) {
      throw new ResponseError("token-not-found", "No token found", 400);
    }

    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      throw new ResponseError("user-not-verified", "User is not verified", 401);
    }

    req.body.user_data = user;

    next();
  } catch (err) {
    if (err instanceof ResponseError) {
      return res
        .status(err.statusCode)
        .json({ status: err.status, message: err.message });
    } else {
      return res.status(401).json({
        status: "invalid-token",
        message: "Token is not valid",
      });
    }
  }
};

export default verifyToken;
