import express, { Request, Response, Router } from "express";
import verifyToken from "../../middleware/VerifyToken";
import Post from "../../models/Post";
import User from "../../models/User";
import { ResponseError } from "../../types/Error";

const getJoinedClubPosts: Router = express.Router();

getJoinedClubPosts.get(
  "/posts/joined-clubs/",
  verifyToken,
  async (req: Request, res: Response) => {
    const userInfo = req.body.user_data;
    const perPage: number = parseInt(req.query.perPage as string) || 10;
    const page: number = parseInt(req.query.page as string) || 1;
    const skipAmount = (page - 1) * perPage;

    try {
      const user = await User.findById(userInfo._id);
      if (!user) {
        throw new ResponseError(
          "user-not-found",
          "User not found with user id",
          422
        );
      }
      const clubIds = user.clubs;

      const posts = await Post.find({ club_id: { $in: clubIds } })
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

      if (!posts || posts.length === 0) {
        throw new ResponseError("no-post-found", "No post found", 400);
      }
      return res.status(200).json({ posts, paginationInfo });
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
  }
);

export default getJoinedClubPosts;
