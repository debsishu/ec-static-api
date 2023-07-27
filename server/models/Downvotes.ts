import mongoose from "mongoose";

const DownvotesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const Downvotes = mongoose.model("Downvotes", DownvotesSchema);

export default Downvotes;
