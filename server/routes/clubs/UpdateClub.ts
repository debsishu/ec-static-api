import express, { Request, Response, Router } from "express";
import verifyToken from "../../middleware/VerifyToken";
import Club from "../../models/Club";
import { MissingInformationError, ResponseError } from "../../types/Error";

const updateClub: Router = express.Router();

// Attributes to update {
//   name?optional
//   club_id?required
//   description?optional
//   profile_picture?optional
//   banner_image?optional
// }
updateClub.post(
  "/clubs/:club_id/update",
  verifyToken,
  async (req: Request, res: Response) => {
    const { name, description, profile_picture, banner_image } = req.body;
    const { club_id } = req.params;
    const userInfo = req.body.user_data;
    try {
      if (!club_id) {
        throw new MissingInformationError("No club_id provided");
      }
      if (!name && !description && !profile_picture && !banner_image) {
        throw new MissingInformationError(
          "Provide atleast one attribute to update"
        );
      }

      const attributesToUpdate = {
        ...(name && { name }),
        ...(description && { description }),
        ...(profile_picture && { club_profile_picture: profile_picture }),
        ...(banner_image && { club_banner_picture: banner_image }),
      };

      const updatedClub = await Club.findOneAndUpdate(
        { club_id: club_id, created_by: userInfo._id },
        attributesToUpdate,
        { new: true }
      );

      if (!updatedClub) {
        throw new ResponseError(
          "no-permission",
          "User is not the creator of the club",
          409
        );
      }

      return res.status(200).json(updatedClub);
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
  }
);

export default updateClub;
