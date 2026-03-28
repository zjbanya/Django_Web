import { useEffect, useMemo, useState } from 'react'

import { posts, type BlogPost } from '../../../lib/posts'
import userApi from '../../../api/user'

type Props = {
  // future: windowId for analytics
}

/**
 * BlogWindowContent：
 * - 作为 WindowManager 内部“窗口内容”使用
 * - 不做 absolute/overlay（让窗口框负责拖拽、缩放、关闭）
 */
export default function BlogWindowContent(_props: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [remotePosts, setRemotePosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string>('')

  const postsSource: BlogPost[] = remotePosts.length ? remotePosts : posts

  const selectedPost: BlogPost | undefined = useMemo(() => {
    if (!selectedSlug) return undefined
    return postsSource.find((p) => p.slug === selectedSlug)
  }, [postsSource, selectedSlug])

  useEffect(() => {
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
              contentMarkdown: String(item.contentMarkdown ?? item.content ?? item.body ?? ''),
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
  }, [])

  return (
    <div className="h-full w-full p-4">
      {isLoading && !selectedPost ? <div className="text-sm text-[#4a4a4a]/70">加载文章中...</div> : null}

      {!selectedPost ? (
        <div className="space-y-3">
          {loadError ? <div className="text-xs text-[#4a4a4a]/60">{loadError}</div> : null}
          {postsSource.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSelectedSlug(p.slug)}
              className="w-full rounded-xl border border-[#e6d9d3] bg-[#fdf7f4] p-3 text-left transition hover:bg-white"
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
          <pre className="mt-3 whitespace-pre-wrap break-words text-xs text-[#4a4a4a]/80">{selectedPost.contentMarkdown}</pre>

          <button
            type="button"
            className="mt-3 rounded-xl border border-[#e6d9d3] bg-white px-3 py-2 text-xs font-semibold text-[#4a4a4a] hover:bg-[#fdf7f4]"
            onClick={() => setSelectedSlug(null)}
          >
            返回列表
          </button>
        </article>
      )}
    </div>
  )
}

