import mongoose from "mongoose"

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: String, default: "" },
    tags: { type: [String], default: [] },
    isPremium: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
)

export default BlogSchema