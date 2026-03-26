import { useMemo, useState } from 'react'

import { posts, type BlogPost } from '../../../lib/posts'

/**
 * 博客窗口（角落显示，不遮挡壁纸中间）：
 * - 列表模式：仅显示日期、标题、摘要
 * - 详情模式：展示该文章的内容占位（你后面可以替换成 MDX/后端接口）
 */
export default function BlogWindow() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const selectedPost: BlogPost | undefined = useMemo(
    () => posts.find((p) => p.slug === selectedSlug),
    [selectedSlug]
  )

  return (
    <section className="w-[420px] rounded-3xl border border-white/10 bg-black/35 backdrop-blur-md p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white/90">Blog</div>
        {selectedSlug ? (
          <button
            type="button"
            className="text-xs text-white/60 hover:text-white/85"
            onClick={() => setSelectedSlug(null)}
          >
            返回
          </button>
        ) : null}
      </div>

      {!selectedPost ? (
        <div className="mt-3 space-y-3">
          {posts.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSelectedSlug(p.slug)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10"
            >
              <div className="text-[11px] text-white/55">{p.date}</div>
              <div className="mt-1 text-sm font-semibold text-white/90">{p.title}</div>
              <div className="mt-1 text-xs text-white/60">{p.summary}</div>
            </button>
          ))}
        </div>
      ) : (
        <article className="mt-3">
          <div className="text-[11px] text-white/55">{selectedPost.date}</div>
          <h2 className="mt-1 text-lg font-semibold text-white/90">{selectedPost.title}</h2>
          <p className="mt-2 text-xs text-white/60">{selectedPost.summary}</p>
          <pre className="mt-3 whitespace-pre-wrap break-words text-xs text-white/75">
            {selectedPost.contentMarkdown}
          </pre>
        </article>
      )}
    </section>
  )
}

