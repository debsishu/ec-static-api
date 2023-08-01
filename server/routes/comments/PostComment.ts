import express, { Request, Response, Router } from "express";
import verifyToken from "../../middleware/VerifyToken";
import { CastError } from "mongoose";
import { MissingInformationError, ResponseError } from "../../types/Error";
import Comment from "../../models/Comment";

const postComment: Router = express.Router();

postComment.post(
  "/comments/:post_id",
  verifyToken,
  async (req: Request, res: Response) => {
    const { comment_id, content, user_data } = req.body;
    const { post_id } = req.params;
    try {
      if (!post_id || !content)
        throw new MissingInformationError("No post id or content provided");

      const comment = await Comment.create({
        author: user_data._id,
        parent_post: post_id,
        content: content,
        ...(comment_id && { parent_comment: comment_id }),
      });

      return res.status(200).json(comment);
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

export default postComment;
