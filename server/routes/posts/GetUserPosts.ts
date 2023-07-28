import express, { Request, Response, Router } from "express";
import { CastError } from "mongoose";
import { MissingInformationError, ResponseError } from "../../types/Error";
import Post from "../../models/Post";

const getUserPosts: Router = express.Router();

getUserPosts.get("/", async (req: Request, res: Response) => {
  const { user_id } = req.query;
  const perPage: number = parseInt(req.query.perPage as string) || 10;
  const page: number = parseInt(req.query.page as string) || 1;

  try {
    if (!user_id) throw new MissingInformationError("No user id provided");

    const userPosts = await Post.find({ user_id })
      .populate([
        {
          path: "user_id",
          select: "username profile_picture",
        },
        {
          path: "club_id",
          select: "club_id",
        },
      ])
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (!userPosts || userPosts.length == 0) {
      throw new ResponseError(
        "no-post-found",
        "No post found under this user",
        404
      );
    }

    return res.status(200).json(userPosts);
  } catch (err) {
    if (err instanceof ResponseError) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else if (err as CastError) {
      return res.status(404).json({
        status: "invalid-object-id",
        message: "User Id is not valid",
      });
    } else {
      return res.status(404).json({ message: "Something went wrong" });
    }
  }
});

export default getUserPosts;
