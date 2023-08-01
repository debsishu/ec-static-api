import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import { MissingInformationError, ResponseError } from "../../types/Error";

dotenv.config();

const login: Router = express.Router();
const JWT_SECRET = process.env.JWTSECRET!;

login.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      throw new MissingInformationError();
    }

    // Fetch the user from database
    let user = await User.findOneAndUpdate(
      { username },
      { last_login: Date.now() },
      { new: true }
    ).populate([
      {
        path: "club_owner",
        select: "club_id",
      },
      {
        path: "clubs",
        select: "club_id",
      },
    ]);

    if (!user) {
      throw new ResponseError(
        "invalid-username-or-password",
        "Username or Password is invalid",
        401
      );
    } else if (await bcrypt.compare(password, user.password!)) {
      const token = jwt.sign(
        { username: user.username, id: user._id },
        JWT_SECRET
      );
      user = user.toObject();
      delete user.password;

      return res.status(200).json({ ...user, token });
    } else {
      throw new ResponseError(
        "invalid-username-or-password",
        "Username or Password is invalid",
        401
      );
    }
  } catch (err) {
    console.log(err);

    if (err instanceof ResponseError) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      return res.status(404).json({ message: "Something went wrong" });
    }
  }
});

export default login;
