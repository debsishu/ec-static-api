import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  club_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true,
  },
  post_title: { type: String, required: true },
  post_content: { type: String, required: true },
  post_image: { type: String },
  timestamp: { type: Date, default: Date.now },
  upvote_count: { type: Number, default: 0 },
  downvote_count: { type: Number, default: 0 },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
