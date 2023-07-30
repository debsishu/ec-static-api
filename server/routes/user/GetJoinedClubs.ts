import express, { Request, Response, Router } from "express";
import verifyToken from "../../middleware/VerifyToken";
import { ResponseError } from "../../types/Error";
import User from "../../models/User";

const getJoinedClubs: Router = express.Router();

getJoinedClubs.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const userInfo = req.body.user_data;
    const user = await User.findById(userInfo._id).populate([
      {
        path: "clubs",
        select: "name club_id member_count",
      },
    ]);
    if (!user || !user.clubs || user.clubs.length === 0) {
      throw new ResponseError(
        "no-club-found",
        "No clubs found where user joined",
        400
      );
    }
    return res.status(200).json(user.clubs);
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

export default getJoinedClubs;
