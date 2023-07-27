import mongoose from "mongoose";
import { ImageProvider } from "../constants/constants";

const ClubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  club_id: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  club_profile_picture: {
    type: String,
    default: ImageProvider.getClubProfilePicture,
  },
  club_banner_picture: {
    type: String,
    default: ImageProvider.getClubBannerPicture,
  },
  member_count: { type: Number, default: 0 },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
});

const Club = mongoose.model("Club", ClubSchema);

export default Club;
