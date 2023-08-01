import express, { Request, Response, Router } from "express";
import { MissingInformationError, ResponseError } from "../../types/Error";
import Post from "../../models/Post";
import { CastError } from "mongoose";

const getClubPosts: Router = express.Router();

getClubPosts.get(
  "/posts/club/:club_id",
  async (req: Request, res: Response) => {
    const { club_id } = req.params;
    const perPage: number = parseInt(req.query.perPage as string) || 10;
    const page: number = parseInt(req.query.page as string) || 1;
    const skipAmount = (page - 1) * perPage;

    try {
      if (!club_id) {
        throw new MissingInformationError("No club id provided");
      }

      const clubPosts = await Post.find({ club_id: club_id })
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

      if (!clubPosts || clubPosts.length === 0) {
        throw new ResponseError(
          "no-post-found",
          "No post found under this club",
          404
        );
      }

      return res.status(200).json({ clubPosts, paginationInfo });
    } catch (err) {
      if (err instanceof ResponseError) {
        return res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
        });
      } else if (err as CastError) {
        return res.status(404).json({
          status: "invalid-object-id",
          message: "Post Id is not valid",
        });
      } else {
        return res.status(404).json({ message: "Something went wrong" });
      }
    }
  }
);

export default getClubPosts;
