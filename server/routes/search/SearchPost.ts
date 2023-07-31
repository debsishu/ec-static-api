import express, { Request, Response, Router } from "express";
import Post from "../../models/Post";
import { MissingInformationError, ResponseError } from "../../types/Error";

const searchPost: Router = express.Router();

searchPost.get("/", async (req: Request, res: Response) => {
  const { searchQuery } = req.query;
  const perPage: number = parseInt(req.query.perPage as string) || 10;
  const page: number = parseInt(req.query.page as string) || 1;
  const skipAmount = (page - 1) * perPage;

  try {
    if (!searchQuery)
      throw new MissingInformationError("No search query provided");

    const searchCriteria = {
      $or: [
        { post_content: { $regex: searchQuery, $options: "i" } },
        { post_title: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const posts = await Post.find(searchCriteria)
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

    if (!posts || posts.length === 0) {
      throw new ResponseError(
        "no-post-found",
        "No post found with the search query",
        400
      );
    }

    const paginationInfo = {
      page,
      perPage,
      hasNextPage: posts.length === perPage,
    };

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

export default searchPost;
