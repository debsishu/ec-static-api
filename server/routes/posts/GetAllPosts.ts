import express, { Request, Response, Router } from "express";
import Post from "../../models/Post";
import { ResponseError } from "../../types/Error";

const getAllPosts: Router = express.Router();

getAllPosts.get("/posts", async (req: Request, res: Response) => {
  const perPage: number = parseInt(req.query.perPage as string) || 10;
  const page: number = parseInt(req.query.page as string) || 1;
  const skipAmount = (page - 1) * perPage;

  try {
    const posts = await Post.find()
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

    if (!posts) {
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
});

export default getAllPosts;
