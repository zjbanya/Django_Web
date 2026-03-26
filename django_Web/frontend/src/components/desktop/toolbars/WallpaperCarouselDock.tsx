import { useMemo, useRef } from 'react'

import { useDesktop } from '../../../state/DesktopContext'

/**
 * 底部壁纸轮播 Dock：
 * - 缩略图水平排列，可左右箭头滚动
 * - 点击缩略图切换全屏壁纸（不刷新）
 * - 当前选中项高亮
 */
export default function WallpaperCarouselDock() {
  const { wallpapers, wallpaperIndex, setWallpaperIndex } = useDesktop()
  const listRef = useRef<HTMLDivElement | null>(null)

  const previews = useMemo(() => wallpapers.slice(0, 9), [wallpapers])

  const scrollBy = (dx: number) => {
    listRef.current?.scrollBy({ left: dx, behavior: 'smooth' })
  }

  return (
    <div className="h-full p-4">
      <div className="mx-auto flex h-full w-full max-w-5xl items-center gap-3">
        <button
          type="button"
          className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
          onClick={() => scrollBy(-260)}
          aria-label="向左滚动"
        >
          ←
        </button>

        <div ref={listRef} className="flex-1 overflow-hidden">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {previews.map((w, idx) => {
              const active = idx === wallpaperIndex
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWallpaperIndex(idx)}
                  className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border transition"
                  style={{
                    borderColor: active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.12)',
                  }}
                  aria-label={`切换壁纸：${w.name}`}
                >
                  <img src={w.thumbUrl} alt={w.name} className="h-full w-full object-cover" />
                  {active ? (
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/10" />
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
          onClick={() => scrollBy(260)}
          aria-label="向右滚动"
        >
          →
        </button>
      </div>
    </div>
  )
}

