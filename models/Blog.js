import mongoose from "mongoose"
import BlogSchema from "@/schemas/BlogSchema"

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema)
export default Blog