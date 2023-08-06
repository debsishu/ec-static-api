import express, { Request, Response, Router } from "express";
import { CastError } from "mongoose";
import { MissingInformationError, ResponseError } from "../../types/Error";
import Post from "../../models/Post";

const getUserPosts: Router = express.Router();

getUserPosts.get(
  "/posts/user/:user_id",
  async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const perPage: number = parseInt(req.query.perPage as string) || 10;
    const page: number = parseInt(req.query.page as string) || 1;
    const criteria: string = (req.query.criteria as string) || "time";
    const skipAmount = (page - 1) * perPage;

    try {
      if (!user_id) throw new MissingInformationError("No user id provided");

      const userPosts = await Post.find({ user_id })
        .sort({
          ...(criteria === "time" ? { timestamp: -1 } : { upvote_count: -1 }),
        })
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
        .skip(skipAmount)
        .limit(perPage);

      const totalCount = await Post.countDocuments();

      const paginationInfo = {
        page,
        perPage,
        hasNextPage: totalCount > skipAmount + perPage,
      };

      if (!userPosts || userPosts.length == 0) {
        throw new ResponseError(
          "no-post-found",
          "No post found under this user",
          404
        );
      }

      return res.status(200).json({ userPosts, paginationInfo });
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
  }
);

export default getUserPosts;
