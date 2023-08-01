import express, { Request, Response, Router } from "express";
import verifyToken from "../../middleware/VerifyToken";
import { MissingInformationError, ResponseError } from "../../types/Error";
import Club from "../../models/Club";
import User from "../../models/User";

const createClub: Router = express.Router();

createClub.post("/clubs", verifyToken, async (req: Request, res: Response) => {
  const { name, club_id, description } = req.body;
  try {
    const userInfo = req.body.user_data;

    if (!name || !club_id || !description) {
      throw new MissingInformationError();
    }

    const newClub = await Club.create({
      name: name,
      club_id: club_id,
      description: description,
      members: [userInfo._id],
      member_count: 1,
      created_by: userInfo._id,
    });

    const fetchUser = await User.findById(userInfo._id);
    fetchUser!.clubs.push(newClub.id);
    fetchUser!.club_owner.push(newClub.id);
    await fetchUser!.save();

    return res.status(200).json(newClub);
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

export default createClub;
