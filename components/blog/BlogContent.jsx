"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import { useBlogs } from "@/hooks/useBlogs"
import { useSubscription } from "@/hooks/useSubscription"
import Spinner from "@/components/ui/Spinner"
import Link from "next/link"
import {
  RiEyeLine,
  RiTimeLine,
  RiFileTextLine,
  RiStarFill,
  RiShieldLine,
  RiArrowRightLine,
  RiPriceTag3Line,
  RiCalendarLine,
} from "react-icons/ri"

/* ── Google Fonts injected once ─────────────────────────────────────────── */
function InjectFonts() {
  useEffect(() => {
    if (document.getElementById("blog-fonts")) return
    const link = document.createElement("link")
    link.id = "blog-fonts"
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lora:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
    document.head.appendChild(link)
  }, [])
  return null
}

/* ── Table of Contents ──────────────────────────────────────────────────── */
function TableOfContents({ headings, activeId }) {
  if (!headings.length) return null
  return (
    <aside className="sticky top-8 hidden lg:block" style={{ width: "13rem", flexShrink: 0 }}>
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "9px",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#94a3b8",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
      }}>
        <RiFileTextLine size={11} />
        Contents
      </p>
      <nav>
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" })
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              paddingLeft: h.level === 3 ? "1.25rem" : "0.75rem",
              paddingTop: "0.3rem",
              paddingBottom: "0.3rem",
              fontSize: "12.5px",
              fontFamily: "'Lora', Georgia, serif",
              borderLeft: `2px solid ${activeId === h.id ? "#b45309" : "#e2e8f0"}`,
              color: activeId === h.id ? "#b45309" : "#94a3b8",
              textDecoration: "none",
              transition: "all 0.15s",
              lineHeight: 1.4,
            }}
          >
            {activeId === h.id && <RiArrowRightLine size={11} style={{ flexShrink: 0 }} />}
            {h.text}
          </a>
        ))}
      </nav>
    </aside>
  )
}

/* ── Reading Progress ───────────────────────────────────────────────────── */
function ReadingProgress({ progress }) {
  return (
    <div style={{ height: "2px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden", marginBottom: "2rem" }}>
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #b45309, #d97706)",
          borderRadius: "9999px",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  )
}

/* ── Premium Gate ───────────────────────────────────────────────────────── */
function PremiumGate() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
      border: "1px solid #fcd34d",
      borderRadius: "1.25rem",
      padding: "3.5rem 2.5rem",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "9rem", fontWeight: 900, color: "#fcd34d",
        opacity: 0.3, pointerEvents: "none", userSelect: "none",
        whiteSpace: "nowrap",
      }}>
        PREMIUM
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <RiShieldLine size={48} color="#b45309" />
        </div>
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "1.6rem", fontWeight: 700,
          color: "#78350f", marginBottom: "0.75rem",
        }}>
          Subscribers Only
        </h3>
        <p style={{
          fontFamily: "'Lora', Georgia, serif",
          color: "#92400e", fontSize: "0.95rem",
          marginBottom: "1.75rem", lineHeight: 1.7,
          maxWidth: "26rem", margin: "0 auto 1.75rem",
        }}>
          Unlock the full article and every premium post for just $5/month.
        </p>
        <Link
          href="/subscribe"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#b45309",
            color: "#fff",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.8rem",
            fontWeight: 500,
            letterSpacing: "0.08em",
            padding: "0.75rem 2rem",
            borderRadius: "0.5rem",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
        >
          SUBSCRIBE NOW
          <RiArrowRightLine size={15} />
        </Link>
      </div>
    </div>
  )
}

/* ── Helpers ────────────────────────────────────────────────────────────── */
function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim()
}
function extractHeadings(html) {
  if (typeof window === "undefined") return []
  const div = document.createElement("div")
  div.innerHTML = html
  return Array.from(div.querySelectorAll("h2, h3")).map((node) => ({
    id: node.id || slugify(node.textContent),
    text: node.textContent,
    level: parseInt(node.tagName[1]),
  }))
}
function injectHeadingIds(html) {
  return html.replace(/<(h[23])(.*?)>(.*?)<\/\1>/gi, (_, tag, attrs, text) => {
    const id = slugify(text.replace(/<[^>]*>/g, ""))
    return `<${tag}${attrs} id="${id}">${text}</${tag}>`
  })
}
function estimateReadTime(html) {
  const text = html?.replace(/<[^>]*>/g, "") ?? ""
  return Math.max(1, Math.round(text.trim().split(/\s+/).length / 200))
}

/* ── Prose styles ───────────────────────────────────────────────────────── */
const PROSE_STYLES = `
  .blog-prose {
    font-family: 'Lora', Georgia, 'Times New Roman', serif;
    font-size: 1.075rem;
    line-height: 1.95;
    color: #1c1917;
  }
  .blog-prose h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: #0c0a09;
    margin-top: 3rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e7e5e4;
    line-height: 1.3;
  }
  .blog-prose h3 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.3rem;
    font-weight: 700;
    font-style: italic;
    color: #1c1917;
    margin-top: 2.25rem;
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }
  .blog-prose p { margin-bottom: 1.6rem; }
  .blog-prose a {
    color: #b45309;
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: #fcd34d;
    transition: color 0.15s;
  }
  .blog-prose a:hover { color: #92400e; }
  .blog-prose strong { font-weight: 600; color: #0c0a09; }
  .blog-prose em { font-style: italic; color: #44403c; }
  .blog-prose blockquote {
    border-left: 3px solid #b45309;
    background: #fffbeb;
    margin: 2rem 0;
    padding: 1.25rem 1.5rem;
    border-radius: 0 0.75rem 0.75rem 0;
    font-style: italic;
    color: #78350f;
    font-size: 1.05rem;
  }
  .blog-prose blockquote p { margin-bottom: 0; }
  .blog-prose code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.84rem;
    background: #f5f5f4;
    color: #7c3aed;
    padding: 0.15em 0.45em;
    border-radius: 0.3rem;
    border: 1px solid #e7e5e4;
  }
  .blog-prose pre {
    background: #1c1917;
    border-radius: 0.875rem;
    padding: 1.5rem;
    overflow-x: auto;
    margin: 2rem 0;
    border: 1px solid #292524;
  }
  .blog-prose pre code {
    background: transparent;
    border: none;
    color: #d6d3d1;
    font-size: 0.85rem;
    padding: 0;
  }
  .blog-prose ul, .blog-prose ol { padding-left: 1.75rem; margin-bottom: 1.6rem; }
  .blog-prose li { margin-bottom: 0.5rem; padding-left: 0.25rem; }
  .blog-prose ul li::marker { color: #b45309; }
  .blog-prose ol li::marker {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    color: #b45309;
    font-weight: 500;
  }
  .blog-prose img {
    border-radius: 0.875rem;
    margin: 2rem auto;
    max-width: 100%;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  }
  .blog-prose hr { border: none; border-top: 1px solid #e7e5e4; margin: 3rem 0; }
  .blog-prose table { width: 100%; border-collapse: collapse; margin: 2rem 0; font-size: 0.92rem; }
  .blog-prose th {
    background: #fafaf9;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #78716c;
    padding: 0.75rem 1rem;
    border-bottom: 2px solid #e7e5e4;
    text-align: left;
  }
  .blog-prose td { padding: 0.75rem 1rem; border-bottom: 1px solid #f5f5f4; color: #1c1917; }
  .blog-prose tr:last-child td { border-bottom: none; }
`

function InjectProseStyles() {
  useEffect(() => {
    if (document.getElementById("blog-prose-styles")) return
    const style = document.createElement("style")
    style.id = "blog-prose-styles"
    style.textContent = PROSE_STYLES
    document.head.appendChild(style)
  }, [])
  return null
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function BlogContent({ blogId }) {
  const { fetchBlogById } = useBlogs()
  const { isSubscribed } = useSubscription()

  const [blog, setBlog]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState("")
  const [progress, setProgress] = useState(0)
  const [optimisticPremium, setOptimisticPremium] = useState(false)

  const articleRef = useRef(null)

  useEffect(() => {
    if (sessionStorage.getItem("paymentPending") === "true") setOptimisticPremium(true)
  }, [])

  useEffect(() => {
    if (isSubscribed) setOptimisticPremium(false)
  }, [isSubscribed])

  const isPremium = isSubscribed || optimisticPremium

  // ── Fetch blog ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!blogId) return
    setLoading(true); setError(null)
    fetchBlogById(blogId)
      .then((data) => { setBlog(data); setLoading(false) })
      .catch((err)  => { setError(err);  setLoading(false) })
  }, [blogId])

  // ── Increment view once when blog._id is available ────────────────────────
  useEffect(() => {
    if (!blog?._id) return
    fetch(`/api/blogs/${blog._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incrementView: true }),
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.views === "number") {
          setBlog(prev => ({ ...prev, views: data.views }))
        }
      })
      .catch(() => {})
  }, [blog?._id])

  // ── Extract headings ──────────────────────────────────────────────────────
  useEffect(() => {
    if (blog?.content) setHeadings(extractHeadings(blog.content))
  }, [blog])

  // ── Scroll handler ────────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const el = articleRef.current
    if (!el) return
    const { top, height } = el.getBoundingClientRect()
    setProgress(Math.round(Math.max(0, Math.min(100, (-top / (height - window.innerHeight)) * 100))))
    const ids = headings.map((h) => h.id)
    for (let i = ids.length - 1; i >= 0; i--) {
      const node = document.getElementById(ids[i])
      if (node && node.getBoundingClientRect().top < 120) { setActiveId(ids[i]); break }
    }
  }, [headings])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  if (loading) return <div className="flex justify-center py-24"><Spinner /></div>
  if (error || !blog) return (
    <p style={{ fontFamily: "'Lora', serif", textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
      Blog not found.
    </p>
  )

  const processedContent = injectHeadingIds(blog.content ?? "")
  const readTime  = estimateReadTime(blog.content)
  const wordCount = (blog.content?.replace(/<[^>]*>/g, "").trim().split(/\s+/).length ?? 0).toLocaleString()

  return (
    <>
      <InjectFonts />
      <InjectProseStyles />

      <article ref={articleRef} style={{ maxWidth: "56rem", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Hero image */}
        {blog.coverImage && (
          <div style={{ marginBottom: "2.5rem", borderRadius: "1.25rem", overflow: "hidden", aspectRatio: "16/9", background: "#f5f5f4" }}>
            <img src={blog.coverImage} alt={blog.title} width={1280} height={720}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        {/* Meta row */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
          {blog.isPremium ? (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
              letterSpacing: "0.12em", textTransform: "uppercase",
              background: "#fffbeb", border: "1px solid #fcd34d",
              color: "#b45309", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: "0.35rem",
            }}>
              <RiStarFill size={10} />
              Premium
            </span>
          ) : (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
              letterSpacing: "0.12em", textTransform: "uppercase",
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              color: "#15803d", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontWeight: 600,
            }}>Free</span>
          )}

          {blog.category && (
            <span style={{
              fontFamily: "'Lora', serif", fontSize: "12px",
              color: "#78716c", background: "#fafaf9",
              border: "1px solid #e7e5e4", padding: "0.2rem 0.65rem", borderRadius: "9999px",
              display: "inline-flex", alignItems: "center", gap: "0.3rem",
            }}>
              <RiPriceTag3Line size={11} />
              {blog.category}
            </span>
          )}

          <span style={{ color: "#d6d3d1" }}>·</span>

          <span style={{
            fontFamily: "'Lora', serif", fontSize: "13px", color: "#a8a29e", fontStyle: "italic",
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
          }}>
            <RiCalendarLine size={12} />
            {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>

          <span style={{ color: "#d6d3d1" }}>·</span>

          <span style={{
            fontFamily: "'Lora', serif", fontSize: "13px", color: "#a8a29e",
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
          }}>
            <RiEyeLine size={13} />
            {blog.views?.toLocaleString()} views
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 900, lineHeight: 1.2,
          color: "#0c0a09", marginBottom: "1.25rem",
          letterSpacing: "-0.01em",
        }}>
          {blog.title}
        </h1>

        {/* Excerpt */}
        {blog.excerpt && (
          <p style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "1.15rem", fontStyle: "italic",
            color: "#78716c", lineHeight: 1.75,
            borderLeft: "3px solid #b45309",
            paddingLeft: "1.25rem",
            marginBottom: "1.75rem",
          }}>
            {blog.excerpt}
          </p>
        )}

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
            {blog.tags.map((tag) => (
              <span key={tag} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
                color: "#b45309", background: "#fffbeb",
                border: "1px solid #fde68a", padding: "0.2rem 0.65rem",
                borderRadius: "9999px",
                display: "inline-flex", alignItems: "center", gap: "0.25rem",
              }}>
                <RiPriceTag3Line size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read time */}
        <div style={{
          display: "flex", gap: "0.75rem", alignItems: "center",
          fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
          color: "#a8a29e", marginBottom: "0.75rem",
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            <RiTimeLine size={12} /> {readTime} min read
          </span>
          <span style={{ color: "#e7e5e4" }}>·</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            <RiFileTextLine size={12} /> ≈ {wordCount} words
          </span>
        </div>

        <ReadingProgress progress={progress} />

        <hr style={{ border: "none", borderTop: "1px solid #e7e5e4", marginBottom: "2.5rem" }} />

        {/* TOC + Body */}
        <div style={{ display: "flex", gap: "3rem", alignItems: "flex-start" }}>
          {headings.length > 0 && <TableOfContents headings={headings} activeId={activeId} />}

          <div style={{ minWidth: 0, flex: 1 }}>
            {blog.isPremium && !isPremium ? (
              <PremiumGate />
            ) : (
              <div
                className="blog-prose"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            )}
          </div>
        </div>
      </article>
    </>
  )
}
