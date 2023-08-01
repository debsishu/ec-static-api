import express, { Request, Response, Router } from "express";
import Club from "../../models/Club";
import { MissingInformationError, ResponseError } from "../../types/Error";

const getClubDetails: Router = express.Router();

getClubDetails.get("/clubs/:club_id", async (req: Request, res: Response) => {
  const { club_id } = req.params;
  try {
    if (!club_id) {
      throw new MissingInformationError();
    }

    const clubDetails = await Club.findOne({ club_id: club_id }).populate([
      {
        path: "created_by",
        select: "username name profile_picture",
      },
    ]);

    return res.status(200).json(clubDetails);
  } catch (err) {
    if (err instanceof ResponseError) {
      return res
        .status(err.statusCode)
        .json({ status: err.status, message: err.message });
    } else {
      return res.status(404).json({ message: "Something went wrong" });
    }
  }
});

export default getClubDetails;
