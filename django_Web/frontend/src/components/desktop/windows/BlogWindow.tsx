import { useEffect, useMemo, useState } from 'react'

import { posts, type BlogPost } from '../../../lib/posts'
import userApi from '../../../api/user'

type Props = {
  open: boolean
  onClose: () => void
}

/**
 * BlogWindow：
 * - 作为唯一覆盖壁纸的“窗口”
 * - open/close 只使用 opacity + transform（避免破坏外部布局）
 * - 内容为占位：先做文章列表；你后续可替换为真实数据/MDX
 */
export default function BlogWindow({ open, onClose }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [remotePosts, setRemotePosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string>('')
  const [shouldRender, setShouldRender] = useState(open)
  const [isExiting, setIsExiting] = useState(false)

  const postsSource: BlogPost[] = remotePosts.length ? remotePosts : posts

  const selectedPost: BlogPost | undefined = useMemo(() => {
    if (!selectedSlug) return undefined
    return postsSource.find((p) => p.slug === selectedSlug)
  }, [postsSource, selectedSlug])

  // 仅在窗口打开时拉取文章列表（失败则回退 mock）
  useEffect(() => {
    if (!open) return
    if (remotePosts.length) return

    let cancelled = false
    setIsLoading(true)
    setLoadError('')

    userApi
      .getPosts()
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data) ? data : data?.posts

        if (!Array.isArray(list)) return

        const mapped: BlogPost[] = list
          .map((item: any) => {
            const slug = String(item.slug ?? item.id ?? item.title ?? '').trim()
            if (!slug) return null

            return {
              slug,
              date: String(item.date ?? item.created_at ?? item.published_at ?? ''),
              title: String(item.title ?? item.name ?? slug),
              summary: String(item.summary ?? item.excerpt ?? ''),
              contentMarkdown:
                String(item.contentMarkdown ?? item.content ?? item.body ?? ''),
            } satisfies BlogPost
          })
          .filter(Boolean) as BlogPost[]

        setRemotePosts(mapped)
      })
      .catch(() => {
        if (cancelled) return
        setLoadError('获取文章失败，已回退到本地占位。')
      })
      .finally(() => {
        if (cancelled) return
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, remotePosts.length])

  // 打开/关闭只负责过渡与挂载卸载（不影响壁纸）
  useEffect(() => {
    if (open) {
      setShouldRender(true)
      setIsExiting(false)
      return
    }

    setIsExiting(true)
    const t = window.setTimeout(() => {
      setShouldRender(false)
      setIsExiting(false)
    }, 180)

    return () => window.clearTimeout(t)
  }, [open])

  if (!shouldRender) return null

  return (
    <section
      className={[
        // 层级要高于 hover 展开的顶部/右侧/底部 Dock
        'absolute left-1/2 top-1/2 z-50 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#e6d9d3] bg-white shadow-xl',
        'transition-opacity transition-transform duration-180 ease-out',
        open && !isExiting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none',
      ].join(' ')}
      aria-label="My Blog window"
    >
      <div className="flex items-center justify-between border-b border-[#e6d9d3] px-4 py-3">
        <div className="text-sm font-semibold text-[#4a4a4a]">My Blog</div>

        <button
          type="button"
          className="rounded-md px-2 py-1 text-xs font-semibold text-[#4a4a4a] hover:bg-[#fdf7f4]"
          onClick={() => onClose()}
          aria-label="关闭博客窗口"
        >
          ×
        </button>
      </div>

      <div className="p-4">
        {/* 列表：先做占位（后续接入 posts / MDX / 后端接口） */}
        {isLoading && !selectedPost ? (
          <div className="text-sm text-[#4a4a4a]/70">加载文章中...</div>
        ) : !selectedPost ? (
          <div className="space-y-3">
            {loadError ? (
              <div className="text-xs text-[#4a4a4a]/60">{loadError}</div>
            ) : null}

            {postsSource.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => setSelectedSlug(p.slug)}
                className="w-full rounded-md border border-[#e6d9d3] bg-[#fdf7f4] p-3 text-left transition hover:bg-white"
              >
                <div className="text-xs text-[#4a4a4a]/60">{p.date}</div>
                <div className="mt-1 text-sm font-semibold text-[#4a4a4a]">{p.title}</div>
                <div className="mt-1 text-xs text-[#4a4a4a]/70">{p.summary}</div>
              </button>
            ))}
          </div>
        ) : (
          <article>
            <div className="text-xs text-[#4a4a4a]/60">{selectedPost.date}</div>
            <h2 className="mt-1 text-lg font-semibold text-[#4a4a4a]">{selectedPost.title}</h2>
            <p className="mt-2 text-xs text-[#4a4a4a]/70">{selectedPost.summary}</p>
            <pre className="mt-3 whitespace-pre-wrap break-words text-xs text-[#4a4a4a]/80">
              {selectedPost.contentMarkdown}
            </pre>

            <button
              type="button"
              className="mt-3 rounded-md border border-[#e6d9d3] bg-white px-3 py-2 text-xs font-semibold text-[#4a4a4a] hover:bg-[#fdf7f4]"
              onClick={() => setSelectedSlug(null)}
            >
              返回列表
            </button>
          </article>
        )}
      </div>
    </section>
  )
}

