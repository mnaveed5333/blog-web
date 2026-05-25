import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isSubscribed: { type: Boolean, default: false },
    readHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }], // ✅ add this
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model("User", userSchema)