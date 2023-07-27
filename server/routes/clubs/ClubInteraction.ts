import express, { Request, Response, Router } from "express";
import verifyToken from "../../middleware/VerifyToken";
import Club from "../../models/Club";
import User from "../../models/User";
import { MissingInformationError, ResponseError } from "../../types/Error";

export const joinClub: Router = express.Router();
export const exitClub: Router = express.Router();

joinClub.post("/", verifyToken, async (req: Request, res: Response) => {
  const { club_id } = req.body;
  try {
    const userInfo = req.body.user_data;

    if (!club_id) {
      throw new MissingInformationError();
    }

    const club = await Club.findOne({
      club_id: club_id,
      members: { $nin: userInfo._id },
    });

    if (!club) {
      throw new ResponseError(
        "already-joined",
        "User already joined the club",
        302
      );
    }

    club.members.push(userInfo._id);
    club.member_count++;
    await club.save();

    const user = await User.findById(userInfo._id);
    user!.clubs.push(club!.id);
    await user!.save();

    return res.status(200).json({
      status: "successful",
      message: "User joined successfully",
    });
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

exitClub.post("/", verifyToken, async (req: Request, res: Response) => {
  const { club_id } = req.body;
  try {
    const userInfo = req.body.user_data;

    if (!club_id) {
      throw new MissingInformationError();
    }

    const club = await Club.findOne({
      club_id: club_id,
      members: { $in: userInfo._id },
    });

    if (!club) {
      throw new ResponseError(
        "user-not-in-club",
        "User not present in the club",
        302
      );
    }

    if (club.created_by!.equals(userInfo._id)) {
      throw new ResponseError(
        "cannot-remove-creator",
        "User is the creator of this club",
        405
      );
    }

    await Club.updateOne(
      { club_id: club_id },
      {
        $pullAll: { members: [{ _id: userInfo._id }] },
        $inc: { member_count: -1 },
      },
      { new: true }
    );

    await User.updateOne(
      { _id: userInfo._id },
      { $pullAll: { clubs: [{ _id: club.id }] } },
      { new: true }
    );

    return res.status(200).json({
      status: "user-left-club-successful",
      message: "User left the club successfully",
    });
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
