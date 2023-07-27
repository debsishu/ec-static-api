import express, { Request, Response, Router } from "express";
import verifyToken from "../../middleware/VerifyToken";
import Post from "../../models/Post";
import { MissingInformationError, ResponseError } from "../../types/Error";
import Club from "../../models/Club";

const createPost: Router = express.Router();

createPost.post("/", verifyToken, async (req: Request, res: Response) => {
  const { club_id, post_title, post_content, post_image } = req.body;
  try {
    const userInfo = req.body.user_data;

    if (!club_id || !post_title || !post_content) {
      throw new MissingInformationError();
    }

    const club = await Club.findOne({
      _id: club_id,
      members: { $in: userInfo._id },
    });

    if (!club) {
      throw new ResponseError(
        "club-user-not-found",
        "Club not found or user not joined club",
        401
      );
    }

    const newPost = await Post.create({
      user_id: userInfo._id,
      club_id: club_id,
      post_title: post_title,
      post_content: post_content,
      ...(post_image && { post_image: post_image }),
    });

    return res.status(200).json(newPost);
  } catch (err) {
    console.log(err);

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

export default createPost;
