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

  const previews = useMemo(() => wallpapers, [wallpapers])

  const scrollBy = (dx: number) => {
    listRef.current?.scrollBy({ left: dx, behavior: 'smooth' })
  }

  return (
    <div className="h-full px-4 py-4">
      <div className="flex h-full w-full items-center">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center gap-3">
        <button
          type="button"
          className="h-10 w-10 rounded-2xl bg-[#f7f0ed] text-[#4a4a4a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(0,0,0,0.07)] hover:bg-[#fbf5f2]"
          onClick={() => scrollBy(-260)}
          aria-label="向左滚动"
        >
          ←
        </button>

        <div ref={listRef} className="flex-1 overflow-hidden">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {previews.map((w, idx) => {
              const active = idx === wallpaperIndex
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWallpaperIndex(idx)}
                  className={[
                    'relative h-24 w-36 shrink-0 overflow-hidden rounded-2xl transition',
                    'shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_12px_28px_rgba(0,0,0,0.12)]',
                    active ? 'ring-2 ring-[#4a4a4a]/25' : 'hover:translate-y-[-1px]',
                  ].join(' ')}
                  aria-label={`切换壁纸：${w.name}`}
                >
                  <img src={w.thumbUrl} alt={w.name} className="h-full w-full object-cover" />
                </button>
              )
            })}
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

