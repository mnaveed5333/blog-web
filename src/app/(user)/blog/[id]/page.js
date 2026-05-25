import BlogContent from "@/components/blog/BlogContent"

export default async function BlogDetailPage({ params }) {
  const { id } = await params
  return (
    <div className="max-w-3xl mx-auto">
      <BlogContent blogId={id} />
    </div>
  )
}