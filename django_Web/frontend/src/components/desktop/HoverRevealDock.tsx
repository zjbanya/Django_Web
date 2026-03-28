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
  // 鼠标移出后延迟隐藏（ms）
  closeDelayMs?: number
  // 关闭触发点：
  // - 'edge'：热区/面板都可能触发（更接近旧行为）
  // - 'panel'：只在面板区域离开时触发
  // - 'content'：只在 children 内容区域离开时触发（用于壁纸面板更精确）
  closeMode?: 'edge' | 'panel' | 'content'
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
  closeDelayMs = 2000,
  closeMode = 'edge',
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
    isTopPinned,
    setIsTopPinned,
    isRightPinned,
    setIsRightPinned,
    isBottomPinned,
    setIsBottomPinned,
  } = useDesktop()

  const open = side === 'top' ? isTopOpen : side === 'right' ? isRightOpen : isBottomOpen
  const setOpen = side === 'top' ? setIsTopOpen : side === 'right' ? setIsRightOpen : setIsBottomOpen
  const pinned =
    side === 'top' ? isTopPinned : side === 'right' ? isRightPinned : isBottomPinned
  const setPinned =
    side === 'top' ? setIsTopPinned : side === 'right' ? setIsRightPinned : setIsBottomPinned

  const hoverTimer = useRef<number | null>(null)
  const lastClickAt = useRef<number>(0)

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

  // 更自然的“呼吸感”：更长时长 + 更柔和的曲线
  const transition = 'transition-all duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]'

  const closeOnHitboxLeave = closeMode === 'edge'
  const closeOnPanelLeave = closeMode === 'edge' || closeMode === 'panel'
  const closeOnContentLeave = closeMode === 'edge' || closeMode === 'content'

  const clearTimer = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
    hoverTimer.current = null
  }

  const requestClose = () => {
    clearTimer()
    if (pinned) return
    hoverTimer.current = window.setTimeout(() => setOpen(false), closeDelayMs)
  }

  const handleDoubleClickLike = () => {
    // “正常双击速度”判定：时间阈值法，不使用计数
    const now = Date.now()
    const delta = now - lastClickAt.current
    lastClickAt.current = now
    if (delta > 0 && delta < 320) {
      setPinned(!pinned)
      if (!open) setOpen(true)
      clearTimer()
    }
  }

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
            clearTimer()
            setOpen(true)
          }}
          onMouseLeave={() => {
            if (closeOnHitboxLeave) requestClose()
          }}
          onPointerDown={() => handleDoubleClickLike()}
        />

        {/* 面板 */}
        <div
          className={`absolute left-[92px] right-0 top-0 z-35 ${transition} ${
            open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
          } ${pinned ? 'shadow-[0_10px_30px_rgba(0,0,0,0.08)]' : ''}`}
          style={{ height: openH }}
          onMouseEnter={() => {
            clearTimer()
            setOpen(true)
          }}
          onMouseLeave={() => {
            if (closeOnPanelLeave) requestClose()
          }}
          onPointerDown={() => handleDoubleClickLike()}
        >
          <div className="h-full rounded-b-[8px] border border-[#e6d9d3] bg-[#fdf7f4] backdrop-blur-0">
            {/* subtle accent */}
            <div
              className="pointer-events-none absolute inset-0 rounded-b-[8px]"
              style={{ background: `linear-gradient(180deg, ${theme.subtle}, transparent)` }}
            />
            <div
              className={closeMode === 'content' ? 'relative' : 'relative h-full'}
              onMouseEnter={() => {
                clearTimer()
                if (!open) setOpen(true)
              }}
              onMouseLeave={() => {
                if (closeOnContentLeave) requestClose()
              }}
            >
              {children}
            </div>
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
            clearTimer()
            setOpen(true)
          }}
          onMouseLeave={() => {
            if (closeOnHitboxLeave) requestClose()
          }}
          onPointerDown={() => handleDoubleClickLike()}
        />

        <div
          className={`absolute right-0 top-0 bottom-0 z-35 ${transition} ${
            open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
          } ${pinned ? 'shadow-[-14px_0_30px_rgba(0,0,0,0.08)]' : ''}`}
          style={{ width: openW }}
          onMouseEnter={() => {
            clearTimer()
            setOpen(true)
          }}
          onMouseLeave={() => {
            if (closeOnPanelLeave) requestClose()
          }}
          onPointerDown={() => handleDoubleClickLike()}
        >
          <div className="h-full rounded-l-[8px] border border-[#e6d9d3] bg-[#fdf7f4]">
            <div
              className="pointer-events-none absolute inset-0 rounded-l-[8px]"
              style={{ background: `linear-gradient(90deg, ${theme.subtle}, transparent)` }}
            />
            <div
              className={closeMode === 'content' ? 'relative' : 'relative h-full'}
              onMouseEnter={() => {
                clearTimer()
                if (!open) setOpen(true)
              }}
              onMouseLeave={() => {
                if (closeOnContentLeave) requestClose()
              }}
            >
              {children}
            </div>
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
          clearTimer()
          setOpen(true)
        }}
        onMouseLeave={() => {
          if (closeOnHitboxLeave) requestClose()
        }}
        onPointerDown={() => handleDoubleClickLike()}
      />

      <div
        className={`absolute left-[92px] right-0 bottom-0 z-35 ${transition} ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        } ${pinned ? 'shadow-[0_-10px_30px_rgba(0,0,0,0.08)]' : ''}`}
        style={{ height: openH }}
        onMouseEnter={() => {
          clearTimer()
          setOpen(true)
        }}
        onMouseLeave={() => {
          if (closeOnPanelLeave) requestClose()
        }}
        onPointerDown={() => handleDoubleClickLike()}
      >
        <div className="h-full rounded-t-[8px] border border-[#e6d9d3] bg-[#fdf7f4]">
          <div
            className="pointer-events-none absolute inset-0 rounded-t-[8px]"
            style={{ background: `linear-gradient(0deg, ${theme.subtle}, transparent)` }}
          />
          <div
            className={closeMode === 'content' ? 'relative' : 'relative h-full'}
            onMouseEnter={() => {
              clearTimer()
              if (!open) setOpen(true)
            }}
            onMouseLeave={() => {
              if (closeOnContentLeave) requestClose()
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

