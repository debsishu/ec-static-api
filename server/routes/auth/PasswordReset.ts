import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import express, { Request, Response, Router } from "express";
import FormData from "form-data";
import jwt from "jsonwebtoken";
import Mailgun from "mailgun.js";
import User from "../../models/User";
import { MissingInformationError, ResponseError } from "../../types/Error";

dotenv.config();

const FRONTEND_HOST = process.env.FRONTEND_HOST!;
const JWT_SECRET = process.env.JWTSECRET!;
const MAILGUN_API = process.env.MAILGUN_API!;

export const forgetPassword: Router = express.Router();
export const resetPassword: Router = express.Router();
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: MAILGUN_API,
});

forgetPassword.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw new MissingInformationError();
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new ResponseError("wrong-email", "Email Address not found", 401);
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 Hour expiry time

    user.reset_token = resetToken;
    user.reset_token_expiry = resetTokenExpiry;
    await user.save();

    const mailBody = {
      from: "Ec-Static<postmaster@sandbox5bdfe53010904aa9b1e8ecae0705c599.mailgun.org>",
      to: [email],
      subject: "Password Reset: Ec-Static",
      text: `Click the link to reset your password: ${FRONTEND_HOST}/reset-password/${resetToken}`,
    };
    mg.messages
      .create("sandbox5bdfe53010904aa9b1e8ecae0705c599.mailgun.org", mailBody)
      .then((msg) =>
        res.status(200).json({
          status: "reset-mail-sent",
          message: "Password Reset Mail Sent",
        })
      )
      .catch((err) => {
        throw new ResponseError("mail-sent-failed", "Mail sending failed", 400);
      });
  } catch (err) {
    if (err instanceof ResponseError) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      return res.status(404).json({
        message: "Something went wrong",
      });
    }
  }
});

resetPassword.post(
  "/reset-password/:token",
  async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      if (!token || !newPassword) {
        throw new MissingInformationError();
      }

      const user = await User.findOne({
        reset_token: token,
        reset_token_expiry: { $gt: Date.now() },
      });

      if (!user) {
        throw new ResponseError(
          "invalid-token",
          "Token maybe invalid or expired",
          401
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.reset_token = undefined;
      user.reset_token_expiry = undefined;
      await user.save();

      const newToken = jwt.sign(
        { username: user.username, id: user._id },
        JWT_SECRET
      );

      return res.status(200).json({
        id: user._id,
        name: user.name,
        username: user.username,
        profile_picture: user.profile_picture,
        cover_photo: user.cover_photo,
        token: newToken,
      });
    } catch (err) {
      if (err instanceof ResponseError) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else {
        return res.status(404).json({
          message: "Something went wrong",
        });
      }
    }
  }
);
