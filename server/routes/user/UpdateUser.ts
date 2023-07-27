import express, { Request, Response, Router } from "express";
import verifyToken from "../../middleware/VerifyToken";
import User from "../../models/User";
import { MissingInformationError, ResponseError } from "../../types/Error";

const updateUser: Router = express.Router();

// Attributes to update {
//   name?optional
//   profile_picture?optional
//   cover_photo?optional
//   bio?optional
// }
updateUser.post("/", verifyToken, async (req: Request, res: Response) => {
  const { name, profile_picture, cover_photo, bio } = req.body;
  const userInfo = req.body.user_data;

  try {
    if (!name && !profile_picture && !cover_photo && !bio) {
      throw new MissingInformationError(
        "Provide atleast one attribute to update"
      );
    }

    const attributesToUpdate = {
      ...(name && { name }),
      ...(profile_picture && { profile_picture }),
      ...(cover_photo && { cover_photo }),
      ...(bio && { bio }),
    };

    const updatedUser = await User.findByIdAndUpdate(
      userInfo._id,
      attributesToUpdate,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw new ResponseError(
        "user-not-found",
        "User not found to update",
        409
      );
    }

    return res.status(200).json(updatedUser);
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

export default updateUser;
