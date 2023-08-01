import express, { Request, Response, Router } from "express";
import { CastError } from "mongoose";
import { MissingInformationError, ResponseError } from "../../types/Error";
import Comment from "../../models/Comment";

const getComments: Router = express.Router();

getComments.get("/comments/:post_id", async (req: Request, res: Response) => {
  const { post_id } = req.params;
  const perPage: number = parseInt(req.query.perPage as string) || 10;
  const page: number = parseInt(req.query.page as string) || 1;
  const skipAmount = (page - 1) * perPage;

  try {
    if (!post_id) throw new MissingInformationError("No post id provided");

    const comments = await Comment.find({ parent_post: post_id })
      .populate([
        {
          // this is to populate self referencing relations
          path: "parent_comment",
          populate: {
            path: "author",
            model: "User",
            select: "name username profile_picture",
          },
        },
        {
          path: "author",
          select: "name username profile_picture",
        },
      ])
      .skip(skipAmount)
      .limit(perPage);

    const totalCount = await Comment.countDocuments();

    const paginationInfo = {
      page,
      perPage,
      hasNextPage: totalCount > skipAmount + perPage,
    };

    if (!comments || comments.length === 0) {
      throw new ResponseError(
        "no-comments-found",
        "No comments found under this post",
        400
      );
    }

    return res.status(200).json({ comments, paginationInfo });
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

export default getComments;
