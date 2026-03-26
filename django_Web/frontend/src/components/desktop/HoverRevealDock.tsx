import { useMemo, useRef, type ReactNode } from 'react'

import { useDesktop } from '../../state/DesktopContext'
import type { ToolbarKey } from '../../state/DesktopContext'

type Side = 'top' | 'right' | 'bottom'

type Props = {
  side: Side
  toolbarKey: ToolbarKey
  // 展开后的面板尺寸
  openSize: { height?: number; width?: number }
  // 鼠标热区厚度（决定触发灵敏度）
  hitThickness?: number
  children: ReactNode
}

/**
 * HoverRevealDock：
 * - 默认隐藏（仅保留 1px 边框线）
 * - 鼠标靠近边缘热区 -> 平滑展开
 * - 收起/展开使用 transform + opacity
 *
 * 注意：UI 只负责渲染 children，展开/收起由 DesktopContext 管理。
 */
export default function HoverRevealDock({
  side,
  toolbarKey,
  openSize,
  hitThickness = 14,
  children,
}: Props) {
  const {
    accentHue,
    isTopOpen,
    setIsTopOpen,
    isRightOpen,
    setIsRightOpen,
    isBottomOpen,
    setIsBottomOpen,
  } = useDesktop()

  const open = side === 'top' ? isTopOpen : side === 'right' ? isRightOpen : isBottomOpen
  const setOpen = side === 'top' ? setIsTopOpen : side === 'right' ? setIsRightOpen : setIsBottomOpen

  const hoverTimer = useRef<number | null>(null)

  const theme = useMemo(() => {
    const hue = Math.max(0, Math.min(360, accentHue))
    const offsets: Record<ToolbarKey, number> = {
      applications: 300,
      music: 240,
      system: 210,
      wallpapers: 150,
    }
    const h = (hue + offsets[toolbarKey]) % 360
    return {
      // 边框线严格保持统一：#e6d9d3
      line: '#e6d9d3',
      subtle: `hsla(${h} 80% 55% / 0.12)`,
    }
  }, [accentHue, toolbarKey])

  const transition = 'transition-transform duration-300 ease-in-out'

  if (side === 'top') {
    const openH = openSize.height ?? 120
    return (
      <>
        {/* 1px 边框线：默认常驻 */}
        <div
          className="pointer-events-none absolute left-[92px] right-0 top-0 z-30"
          style={{ height: 1, background: theme.line }}
        />

        {/* 热区：扩大到 hitThickness px */}
        <div
          className="absolute left-[92px] right-0 top-0 z-40"
          style={{ height: hitThickness }}
          onMouseEnter={() => {
            if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
            setOpen(true)
          }}
          onMouseLeave={() => {
            if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
            hoverTimer.current = window.setTimeout(() => setOpen(false), 120)
          }}
        />

        {/* 面板 */}
        <div
          className={`absolute left-[92px] right-0 top-0 z-35 ${transition} ${
            open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
          }`}
          style={{ height: openH }}
          onMouseEnter={() => {
            if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
            setOpen(true)
          }}
          onMouseLeave={() => {
            if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
            hoverTimer.current = window.setTimeout(() => setOpen(false), 120)
          }}
        >
          <div className="h-full rounded-b-[8px] border border-[#e6d9d3] bg-[#fdf7f4] backdrop-blur-0">
            {/* subtle accent */}
            <div
              className="pointer-events-none absolute inset-0 rounded-b-[8px]"
              style={{ background: `linear-gradient(180deg, ${theme.subtle}, transparent)` }}
            />
            <div className="relative h-full">{children}</div>
          </div>
        </div>
      </>
    )
  }

  if (side === 'right') {
    const openW = openSize.width ?? 320
    return (
      <>
        {/* 1px 边框线 */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-30"
          style={{ width: 1, background: theme.line }}
        />

        <div
          className="absolute right-0 top-0 bottom-0 z-40"
          style={{ width: hitThickness }}
          onMouseEnter={() => {
            if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
            setOpen(true)
          }}
          onMouseLeave={() => {
            if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
            hoverTimer.current = window.setTimeout(() => setOpen(false), 120)
          }}
        />

        <div
          className={`absolute right-0 top-0 bottom-0 z-35 ${transition} ${
            open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
          }`}
          style={{ width: openW }}
          onMouseEnter={() => {
            if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
            setOpen(true)
          }}
          onMouseLeave={() => {
            if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
            hoverTimer.current = window.setTimeout(() => setOpen(false), 120)
          }}
        >
          <div className="h-full rounded-l-[8px] border border-[#e6d9d3] bg-[#fdf7f4]">
            <div
              className="pointer-events-none absolute inset-0 rounded-l-[8px]"
              style={{ background: `linear-gradient(90deg, ${theme.subtle}, transparent)` }}
            />
            <div className="relative h-full">{children}</div>
          </div>
        </div>
      </>
    )
  }

  // bottom
  const openH = openSize.height ?? 160
  return (
    <>
      <div
        className="pointer-events-none absolute left-[92px] right-0 bottom-0 z-30"
        style={{ height: 1, background: theme.line }}
      />

      <div
        className="absolute left-[92px] right-0 bottom-0 z-40"
        style={{ height: hitThickness }}
        onMouseEnter={() => {
          if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
          setOpen(true)
        }}
        onMouseLeave={() => {
          if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
          hoverTimer.current = window.setTimeout(() => setOpen(false), 120)
        }}
      />

      <div
        className={`absolute left-[92px] right-0 bottom-0 z-35 ${transition} ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{ height: openH }}
        onMouseEnter={() => {
          if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
          setOpen(true)
        }}
        onMouseLeave={() => {
          if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
          hoverTimer.current = window.setTimeout(() => setOpen(false), 120)
        }}
      >
        <div className="h-full rounded-t-[8px] border border-[#e6d9d3] bg-[#fdf7f4]">
          <div
            className="pointer-events-none absolute inset-0 rounded-t-[8px]"
            style={{ background: `linear-gradient(0deg, ${theme.subtle}, transparent)` }}
          />
          <div className="relative h-full">{children}</div>
        </div>
      </div>
    </>
  )
}

