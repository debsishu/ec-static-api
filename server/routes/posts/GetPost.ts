import express, { Request, Response, Router } from "express";
import { CastError } from "mongoose";
import Post from "../../models/Post";
import { MissingInformationError, ResponseError } from "../../types/Error";

const getPost: Router = express.Router();

getPost.get("/", async (req: Request, res: Response) => {
  const { post_id } = req.query;
  try {
    if (!post_id) throw new MissingInformationError("Post Id not provided");

    const post = await Post.findById(post_id).populate([
      {
        path: "user_id",
        select: "username profile_picture",
      },
      {
        path: "club_id",
        select: "club_id",
      },
    ]);

    if (!post) {
      throw new ResponseError(
        "post-not-found",
        "Post not found with the post id",
        404
      );
    }

    return res.status(200).json(post);
  } catch (err) {
    console.log(err);

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
});

export default getPost;
