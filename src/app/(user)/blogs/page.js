import BlogList from "@/components/blog/BlogList"

export default function BlogsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">All Blogs</h1>
        <p className="text-slate-500 mt-2">Browse free and premium content</p>
      </div>
      <BlogList />
    </div>
  )
}