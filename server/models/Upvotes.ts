import mongoose from "mongoose";

const UpvotesSchema = new mongoose.Schema({
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

const Upvotes = mongoose.model("Upvotes", UpvotesSchema);

export default Upvotes;
