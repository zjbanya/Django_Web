import React from 'react'

import { useDesktop } from '../../state/DesktopContext'
import ToolEdge from './ToolEdge'
import ApplicationsDock from './toolbars/ApplicationsDock'
import MusicBar from './toolbars/MusicBar'
import SystemSettingsDrawer from './toolbars/SystemSettingsDrawer'
import WallpaperCarouselDock from './toolbars/WallpaperCarouselDock'
import BlogWindow from './windows/BlogWindow'

type Props = {
  // 如果你未来要做路由/弹窗，只需要替换 children 渲染即可
  renderWindow?: () => React.ReactNode
}

/**
 * 桌面壳（Desktop Shell）：
 * - 全屏壁纸层（中间完全干净，不覆盖）
 * - 四个工具栏 Dock（默认隐藏，仅露出边界，悬停滑出）
 * - 非居中的窗口层放博客入口（避免遮挡壁纸中间区域）
 */
export default function DesktopShell({ renderWindow }: Props) {
  const { wallpapers, wallpaperIndex, activeApp } = useDesktop()
  const active = wallpapers[wallpaperIndex]

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* 壁纸层：铺满；中间区域无 UI 叠加 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: active ? `url(${active.url})` : undefined,
        }}
      />

      {/* 工具栏层 */}
      <ToolEdge toolKey="applications" side="left">
        <ApplicationsDock />
      </ToolEdge>

      <ToolEdge toolKey="music" side="top">
        <MusicBar />
      </ToolEdge>

      <ToolEdge toolKey="system" side="right">
        <SystemSettingsDrawer />
      </ToolEdge>

      <ToolEdge toolKey="wallpapers" side="bottom">
        <WallpaperCarouselDock />
      </ToolEdge>

      {/* 窗口层（角落展示，不覆盖中间壁纸） */}
      <div className="absolute left-4 top-24 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          {renderWindow
            ? renderWindow()
            : activeApp === 'blog'
              ? <BlogWindow />
              : null}
        </div>
      </div>
    </div>
  )
}

