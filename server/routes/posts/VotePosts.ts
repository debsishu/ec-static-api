import express, { Request, Response, Router } from "express";
import { CastError } from "mongoose";
import verifyToken from "../../middleware/VerifyToken";
import Post from "../../models/Post";
import { MissingInformationError, ResponseError } from "../../types/Error";
import { removeElement } from "../../util/Helpers";

const upvotePost: Router = express.Router();
const downvotePost: Router = express.Router();

upvotePost.post("/", verifyToken, async (req: Request, res: Response) => {
  const { post_id, user_data } = req.body;
  try {
    if (!post_id) {
      throw new MissingInformationError("No post id provided");
    }

    const post = await Post.findById(post_id);

    if (!post) {
      throw new ResponseError(
        "no-post-found",
        "No post found with the post id",
        404
      );
    }

    // Remove the user from downvotes
    if (post.downvotes.includes(user_data._id)) {
      post.downvotes = removeElement(post.downvotes, user_data._id);
      post.downvote_count--;
    }

    // Remove the upvote
    if (post.upvotes.includes(user_data._id)) {
      post.upvotes = removeElement(post.upvotes, user_data._id);
      post.upvote_count--;
      await post.save();
      return res.status(200).json({
        status: "upvote-removed",
        message: "Already upvoted, upvote removed",
      });
    } else {
      post.upvotes.push(user_data._id);
      post.upvote_count++;
      await post.save();
      return res.status(200).json({
        status: "upvoted",
        message: "Upvoted successfully",
      });
    }
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
});

downvotePost.post("/", verifyToken, async (req: Request, res: Response) => {
  const { post_id, user_data } = req.body;
  try {
    if (!post_id) {
      throw new MissingInformationError("No post id provided");
    }

    const post = await Post.findById(post_id);

    if (!post) {
      throw new ResponseError(
        "no-post-found",
        "No post found with the post id",
        404
      );
    }

    // Remove the user from upvotes
    if (post.upvotes.includes(user_data._id)) {
      post.upvotes = removeElement(post.upvotes, user_data._id);
      post.upvote_count--;
    }

    // Remove the downvote
    if (post.downvotes.includes(user_data._id)) {
      post.downvotes = removeElement(post.downvotes, user_data._id);
      post.downvote_count--;
      await post.save();
      return res.status(200).json({
        status: "downvote-removed",
        message: "Already downvoted, downvote removed",
      });
    } else {
      post.downvotes.push(user_data._id);
      post.downvote_count++;
      await post.save();
      return res.status(200).json({
        status: "downvoted",
        message: "Downvoted successfully",
      });
    }
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

export { downvotePost, upvotePost };
