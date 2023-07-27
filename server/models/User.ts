import mongoose from "mongoose";
import { ImageProvider } from "../constants/constants";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_picture: { type: String, default: ImageProvider.getProfilePicture },
  cover_photo: {
    type: String,
    default: ImageProvider.getProfileCoverPicture,
  },
  bio: { type: String },
  registration_date: { type: Date, default: Date.now },
  last_login: { type: Date, default: Date.now },
  clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
  club_owner: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
  reset_token: { type: String },
  reset_token_expiry: { type: Date },
});

const User = mongoose.model("User", UserSchema);

export default User;
