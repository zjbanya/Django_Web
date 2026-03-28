import { useEffect, useMemo, useRef, useState } from 'react'

import { useDesktop } from '../../state/DesktopContext'
import ApplicationsDock from './toolbars/ApplicationsDock'
import MusicBar from './toolbars/MusicBar'
import SystemSettingsDrawer from './toolbars/SystemSettingsDrawer'
import WallpaperCarouselDock from './toolbars/WallpaperCarouselDock'
import HoverRevealDock from './HoverRevealDock'
import WindowManager from '../../windowing/WindowManager'

/**
 * 桌面壳（Desktop Shell）v4：
 * - 固定尺寸桌面窗口：1200x800
 * - 左侧 Applications Dock 永远完全显示
 * - 顶部/右侧/底部 Dock 默认隐藏，仅露出 1px 边框；鼠标靠近边缘展开
 * - 中间壁纸区域默认完全干净（仅 BlogWindow 会覆盖）
 */
export default function DesktopShell() {
  const { wallpapers, activeWallpaperId } = useDesktop()
  const active = wallpapers.find((w) => w.id === activeWallpaperId) ?? wallpapers[0]

  const shellInnerRef = useRef<HTMLDivElement | null>(null)
  const [bounds, setBounds] = useState<{ left: number; top: number; right: number; bottom: number } | undefined>()

  useEffect(() => {
    const el = shellInnerRef.current
    if (!el) return

    const update = () => {
      const r = el.getBoundingClientRect()
      setBounds({ left: r.left, top: r.top, right: r.right, bottom: r.bottom })
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const stableBounds = useMemo(() => bounds, [bounds])

  return (
    <div className="fixed inset-0 bg-[#fdf7f4]" aria-label="Desktop shell">
      {/* 外框：加宽内边距 + 更圆角，更接近“系统外壳” */}
      <div className="relative h-full w-full p-[14px]">
        <div
          ref={shellInnerRef}
          className="relative h-full w-full overflow-hidden rounded-[22px] border border-[#e6d9d3] bg-[#fdf7f4] shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
        >
          {/* 壁纸层：默认绝对全屏铺底，三栏默认隐藏不会遮挡中间 */}
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center " // rounded-[30px] shadow-inner
            style={{ backgroundImage: active ? `url(${active.url})` : undefined }}
          />

          {/* 壁纸与工具栏交界：立体感内阴影边界（工具栏之间不再加线） */}
          <div className="pointer-events-none absolute inset-0 z-10">
            {/* 左侧 Dock 交界阴影 */}
            <div className="absolute left-[92px] top-0 bottom-0 w-[18px] bg-gradient-to-r from-[rgba(0,0,0,0.10)] to-transparent" />
            {/* 顶部 Dock 交界阴影（收起也存在） */}
            <div className="absolute left-[92px] right-0 top-0 h-[18px] bg-gradient-to-b from-[rgba(0,0,0,0.10)] to-transparent" />
            {/* 右侧 Dock 交界阴影 */}
            <div className="absolute right-0 top-0 bottom-0 w-[18px] bg-gradient-to-l from-[rgba(0,0,0,0.10)] to-transparent" />
            {/* 底部 Dock 交界阴影 */}
            <div className="absolute left-[92px] right-0 bottom-0 h-[18px] bg-gradient-to-t from-[rgba(0,0,0,0.10)] to-transparent" />
          </div>

          {/* 左侧栏：Applications 永远常驻（完全显示） */}
          <aside className="absolute left-0 top-0 bottom-0 z-20 w-[92px] bg-[#fdf7f4]"
          >
            <ApplicationsDock />
          </aside>

          {/* 中间壁纸区域：保持干净，仅 BlogWindow 覆盖 */}
          <main className="absolute inset-0 z-10">
            <WindowManager bounds={stableBounds} />
          </main>

          {/* 顶部/右侧/底部 Dock：默认收起，仅露出边框，鼠标靠近边缘展开 */}
          <HoverRevealDock side="top" toolbarKey="music" openSize={{ height: 132 }} closeDelayMs={825}>
            <MusicBar />
          </HoverRevealDock>

          <HoverRevealDock side="right" toolbarKey="system" openSize={{ width: 320 }} closeDelayMs={825}>
            <SystemSettingsDrawer />
          </HoverRevealDock>

          <HoverRevealDock
            side="bottom"
            toolbarKey="wallpapers"
            openSize={{ height: 160 }}
            closeDelayMs={825}
            closeMode="content"
          >
            <WallpaperCarouselDock />
          </HoverRevealDock>
        </div>
      </div>
    </div>
  )
}

