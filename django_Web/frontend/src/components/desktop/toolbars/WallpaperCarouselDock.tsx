import { useMemo, useRef } from 'react'

import { useDesktop } from '../../../state/DesktopContext'

/**
 * 底部壁纸轮播 Dock：
 * - 缩略图水平排列，可左右箭头滚动
 * - 点击缩略图切换全屏壁纸（不刷新）
 * - 当前选中项高亮
 */
export default function WallpaperCarouselDock() {
  const {
    wallpapers,
    activeWallpaperId,
    setWallpaperId,
    loadMoreWallpapers,
    hasMoreWallpapers,
    isWallpapersLoading,
  } = useDesktop()

  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const previews = useMemo(() => wallpapers, [wallpapers])

  const scrollBy = (dx: number) => {
    scrollerRef.current?.scrollBy({ left: dx, behavior: 'smooth' })
  }

  const onScroll = () => {
    if (!hasMoreWallpapers || isWallpapersLoading) return
    const el = scrollerRef.current
    if (!el) return

    const remaining = el.scrollWidth - el.scrollLeft - el.clientWidth
    if (remaining < 220) {
      void loadMoreWallpapers()
    }
  }

  return (
    // 注意：不要强制 h-full；HoverRevealDock(closeMode=content) 需要 children 高度更贴近卡片区域
    <div className="px-4 py-4">
      <div className="flex w-full items-center">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3">
          <button
            type="button"
            className="h-10 w-10 rounded-2xl bg-[#f7f0ed] text-[#4a4a4a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(0,0,0,0.07)] hover:bg-[#fbf5f2]"
            onClick={() => scrollBy(-260)}
            aria-label="向左滚动"
          >
            ←
          </button>

          <div className="flex-1 overflow-hidden">
            <div
              ref={scrollerRef}
              className="flex gap-3 overflow-x-auto pb-2"
              onScroll={onScroll}
            >
              {previews.map((w) => {
                const active = w.id === activeWallpaperId
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWallpaperId(w.id)}
                    className={[
                      'relative h-24 w-36 shrink-0 overflow-hidden rounded-2xl transition',
                      'shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_12px_28px_rgba(0,0,0,0.12)]',
                      active ? 'ring-2 ring-[#4a4a4a]/25' : 'hover:translate-y-[-1px]',
                    ].join(' ')}
                    aria-label={`切换壁纸：${w.name}`}
                  >
                    <img src={w.thumbUrl} alt={w.name} className="h-full w-full object-cover" />
                    {active ? <div className="absolute inset-0 border-2 border-[#4a4a4a]/30" /> : null}
                  </button>
                )
              })}

              {isWallpapersLoading ? (
                <div className="flex h-24 w-36 items-center justify-center rounded-2xl bg-white/40 text-xs text-[#4a4a4a]/60">
                  Loading...
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            className="h-10 w-10 rounded-2xl bg-[#f7f0ed] text-[#4a4a4a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(0,0,0,0.07)] hover:bg-[#fbf5f2]"
            onClick={() => scrollBy(260)}
            aria-label="向右滚动"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

