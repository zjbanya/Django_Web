import React, { useMemo } from 'react'

import type { ToolbarKey } from '../../state/DesktopContext'
import { useDesktop } from '../../state/DesktopContext'

type Props = {
  toolKey: ToolbarKey
  side: 'left' | 'top' | 'right' | 'bottom'
  children: React.ReactNode
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max))
}

/**
 * 工具栏边缘交互壳：
 * - 默认仅露出边界细线
 * - 鼠标进入热区后，面板平滑滑出（transform + opacity）
 * - 状态由 DesktopContext 管理，子组件只负责内容渲染
 */
export default function ToolEdge({ toolKey, side, children }: Props) {
  const { openToolbars, setOpenToolbar, accentHue } = useDesktop()
  const open = Boolean(openToolbars[toolKey])

  const theme = useMemo(() => {
    const hue = clamp(accentHue, 0, 360)
    const offsets: Record<ToolbarKey, number> = {
      applications: 300,
      music: 240,
      system: 210,
      wallpapers: 150,
    }
    const h = (hue + offsets[toolKey]) % 360
    return {
      h,
      panelBg: `hsla(${h} 85% 55% / 0.16)`,
      panelBg2: `hsla(${(h + 22) % 360} 85% 55% / 0.10)`,
      border: `hsla(${h} 90% 65% / 0.45)`,
    }
  }, [accentHue, toolKey])

  const sizes = (() => {
    if (side === 'left') return { hitW: 16, lineW: 2, openW: 180, closedW: 0 }
    if (side === 'right') return { hitW: 16, lineW: 2, openW: 320, closedW: 0 }
    if (side === 'top') return { hitH: 14, lineH: 2, openH: 120, closedH: 0 }
    return { hitH: 14, lineH: 2, openH: 170, closedH: 0 } // bottom
  })()

  // 统一面板层级与过渡
  const transition = 'transition-transform duration-300 ease-out will-change-transform'

  if (side === 'left') {
    return (
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20">
        {/* 热区：更灵敏 */}
        <div
          className="pointer-events-auto absolute left-0 top-0 bottom-0"
          style={{ width: (sizes as any).hitW }}
          onMouseEnter={() => setOpenToolbar(toolKey, true)}
          onMouseLeave={() => setOpenToolbar(toolKey, false)}
        />

        {/* 边界细线：默认可见 */}
        <div className="absolute left-0 top-0 bottom-0" style={{ width: (sizes as any).lineW }}>
          <div
            className="absolute inset-0 rounded-r-full"
            style={{ background: theme.border }}
          />
        </div>

        {/* 面板 */}
        <div
          className={`pointer-events-auto absolute left-0 top-0 bottom-0 ${transition} ${
            open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}
          style={{ width: (sizes as any).openW }}
        >
          <div
            className="h-full w-full rounded-tr-3xl rounded-br-3xl border border-white/10 backdrop-blur-md"
            style={{
              background: `linear-gradient(180deg, ${theme.panelBg}, ${theme.panelBg2})`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }

  if (side === 'right') {
    return (
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20">
        <div
          className="pointer-events-auto absolute right-0 top-0 bottom-0"
          style={{ width: (sizes as any).hitW }}
          onMouseEnter={() => setOpenToolbar(toolKey, true)}
          onMouseLeave={() => setOpenToolbar(toolKey, false)}
        />

        <div className="absolute right-0 top-0 bottom-0" style={{ width: (sizes as any).lineW }}>
          <div
            className="absolute inset-0 rounded-l-full"
            style={{ background: theme.border }}
          />
        </div>

        <div
          className={`pointer-events-auto absolute right-0 top-0 bottom-0 ${transition} ${
            open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
          style={{ width: (sizes as any).openW }}
        >
          <div
            className="h-full w-full rounded-tl-3xl rounded-bl-3xl border border-white/10 backdrop-blur-md"
            style={{
              background: `linear-gradient(180deg, ${theme.panelBg}, ${theme.panelBg2})`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }

  if (side === 'top') {
    return (
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20">
        <div
          className="pointer-events-auto absolute left-0 right-0 top-0"
          style={{ height: (sizes as any).hitH }}
          onMouseEnter={() => setOpenToolbar(toolKey, true)}
          onMouseLeave={() => setOpenToolbar(toolKey, false)}
        />

        <div className="absolute left-0 right-0 top-0" style={{ height: (sizes as any).lineH }}>
          <div
            className="absolute inset-0"
            style={{ background: theme.border }}
          />
        </div>

        <div
          className={`pointer-events-auto ${transition} ${
            open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
          style={{ height: (sizes as any).openH }}
        >
          <div
            className="h-full w-full rounded-b-3xl border border-white/10 backdrop-blur-md"
            style={{
              background: `linear-gradient(90deg, ${theme.panelBg}, ${theme.panelBg2})`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }

  // bottom
  return (
    <div className="pointer-events-none absolute left-0 right-0 bottom-0 z-20">
      <div
        className="pointer-events-auto absolute left-0 right-0 bottom-0"
        style={{ height: (sizes as any).hitH }}
        onMouseEnter={() => setOpenToolbar(toolKey, true)}
        onMouseLeave={() => setOpenToolbar(toolKey, false)}
      />

      <div className="absolute left-0 right-0 bottom-0" style={{ height: (sizes as any).lineH }}>
        <div className="absolute inset-0" style={{ background: theme.border }} />
      </div>

      <div
        className={`pointer-events-auto ${transition} ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ height: (sizes as any).openH }}
      >
        <div
          className="h-full w-full rounded-t-3xl border border-white/10 backdrop-blur-md"
          style={{
            background: `linear-gradient(90deg, ${theme.panelBg}, ${theme.panelBg2})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

