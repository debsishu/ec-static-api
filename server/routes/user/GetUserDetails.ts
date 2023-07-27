import express, { Request, Response, Router } from "express";
import { MissingInformationError, ResponseError } from "../../types/Error";
import User from "../../models/User";

const getUserDetails: Router = express.Router();

getUserDetails.get("/", async (req: Request, res: Response) => {
  const { username } = req.query;
  try {
    if (!username) {
      throw new MissingInformationError("Please provide username");
    }

    const userInfo = await User.findOne({ username: username })
      .populate([
        {
          path: "club_owner",
          select: "club_id",
        },
        {
          path: "clubs",
          select: "club_id",
        },
      ])
      .select("-password");

    if (!userInfo) {
      throw new ResponseError(
        "user-not-found",
        "The requested user not found",
        404
      );
    }

    return res.status(200).json(userInfo);
  } catch (err) {
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

export default getUserDetails;
