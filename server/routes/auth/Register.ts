import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import { MissingInformationError, ResponseError } from "../../types/Error";
import { validateEmail } from "../../util/Helpers";
import passwordValidator from "../../util/PasswordValidator";

dotenv.config();

const JWT_SECRET = process.env.JWTSECRET!;
const register: Router = express.Router();

register.post("/", async (req: Request, res: Response) => {
  const { name, email, username, password } = req.body;
  try {
    validateFields(name, email, username, password);
    await checkAvailability(username, email);

    // Register the user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { username: newUser.username, id: newUser._id },
      JWT_SECRET
    );

    const responseObject = {
      id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      profile_picture: newUser.profile_picture,
      cover_photo: newUser.cover_photo,
      token: token,
    };

    if (!res.headersSent) {
      return res.status(201).json(responseObject);
    }
  } catch (err) {
    console.log(err);
    if (!res.headersSent) {
      if (err instanceof ResponseError) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else {
        return res.status(404).json({ message: "Something went wrong" });
      }
    }
  }
});

const checkAvailability = async (username: string, email: string) => {
  const dbUsername = await User.findOne({ username: username });
  const dbEmail = await User.findOne({ email: email });

  if (dbUsername && dbEmail) {
    throw new ResponseError(
      "username-email-already-taken",
      "Username and Email already taken",
      400
    );
  }
  if (dbUsername) {
    throw new ResponseError(
      "username-already-taken",
      "Username already taken",
      400
    );
  }
  if (dbEmail) {
    throw new ResponseError("email-already-taken", "Email already taken", 400);
  }
};

const validateFields = (
  name: string,
  email: string,
  username: string,
  password: string
) => {
  if (!name || !email || !username || !password) {
    throw new MissingInformationError();
  }

  if (!validateEmail(email)) {
    throw new ResponseError(
      "invalid-email",
      "Please a valid email address",
      501
    );
  }

  if (!passwordValidator.validate(password)) {
    throw new ResponseError(
      "weak-password",
      "Please enter a strong password",
      501
    );
  }
};

export default register;
