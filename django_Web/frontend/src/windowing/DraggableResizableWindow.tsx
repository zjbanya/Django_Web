import { useCallback, useMemo, useRef } from 'react'

import type { WindowInstance } from './windowTypes'
import { useWindowStore } from './windowStore'

type Props = {
  window: WindowInstance
  bounds?: { left: number; top: number; right: number; bottom: number }
  onRequestClose?: () => void
  children: React.ReactNode
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function DraggableResizableWindow({ window, bounds, children, onRequestClose }: Props) {
  const { closeWindow, focusWindow, updateWindow } = useWindowStore()
  const pointerIdRef = useRef<number | null>(null)
  const dragModeRef = useRef<'drag' | 'resize' | null>(null)

  const minW = 360
  const minH = 300

  const win = window
  const zStyle = useMemo(() => ({ zIndex: win.z }), [win.z])

  const getBounds = useCallback(() => {
    if (!bounds) {
      return { left: 0, top: 0, right: win.w + win.x, bottom: win.h + win.y }
    }
    return bounds
  }, [bounds, win.h, win.w, win.x, win.y])

  const clampWindow = useCallback(
    (patch: Partial<WindowInstance>) => {
      const b = getBounds()
      const nextX = patch.x ?? win.x
      const nextY = patch.y ?? win.y
      const nextW = patch.w ?? win.w
      const nextH = patch.h ?? win.h

      const wClamped = clamp(nextW, minW, b.right - b.left)
      const hClamped = clamp(nextH, minH, b.bottom - b.top)
      const xClamped = clamp(nextX, b.left, b.right - wClamped)
      const yClamped = clamp(nextY, b.top, b.bottom - hClamped)

      updateWindow(win.id, { ...patch, x: xClamped, y: yClamped, w: wClamped, h: hClamped })
    },
    [getBounds, minH, minW, updateWindow, win.id, win.h, win.w, win.x, win.y],
  )

  const onTitlePointerDown = (e: React.PointerEvent) => {
    focusWindow(win.id)
    pointerIdRef.current = e.pointerId
    dragModeRef.current = 'drag'
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)

    const start = { px: e.clientX, py: e.clientY, x: win.x, y: win.y }

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - start.px
      const dy = ev.clientY - start.py
      clampWindow({ x: start.x + dx, y: start.y + dy })
    }

    const onUp = () => {
      dragModeRef.current = null
      pointerIdRef.current = null
      windowCleanup()
    }

    const windowCleanup = () => {
      globalThis.removeEventListener('pointermove', onMove)
      globalThis.removeEventListener('pointerup', onUp)
    }

    globalThis.addEventListener('pointermove', onMove)
    globalThis.addEventListener('pointerup', onUp)
  }

  const onResizePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    focusWindow(win.id)
    pointerIdRef.current = e.pointerId
    dragModeRef.current = 'resize'
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)

    const start = { px: e.clientX, py: e.clientY, w: win.w, h: win.h }

    const onMove = (ev: PointerEvent) => {
      const dw = ev.clientX - start.px
      const dh = ev.clientY - start.py
      clampWindow({ w: start.w + dw, h: start.h + dh })
    }

    const onUp = () => {
      dragModeRef.current = null
      pointerIdRef.current = null
      windowCleanup()
    }

    const windowCleanup = () => {
      globalThis.removeEventListener('pointermove', onMove)
      globalThis.removeEventListener('pointerup', onUp)
    }

    globalThis.addEventListener('pointermove', onMove)
    globalThis.addEventListener('pointerup', onUp)
  }

  return (
    <section
      className="absolute overflow-hidden rounded-[14px] border border-[#e6d9d3] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.16)]"
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        ...zStyle,
      }}
      onPointerDown={() => focusWindow(win.id)}
      role="dialog"
      aria-label={win.title}
    >
      <div
        className="flex cursor-grab items-center justify-between bg-[#fdf7f4] px-3 py-2 border-b border-[#e6d9d3]"
        onPointerDown={onTitlePointerDown}
      >
        <div className="min-w-0 pr-2 text-xs font-semibold text-[#4a4a4a] truncate">{win.title}</div>
        <button
          type="button"
          className="rounded-xl bg-[#fde6e6] px-2.5 py-1 text-sm font-bold text-[#9b2c2c] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:bg-[#fbd5d5]"
          onPointerDown={(ev) => ev.stopPropagation()}
          onClick={(ev) => {
            ev.stopPropagation()
            onRequestClose?.()
            closeWindow(win.id)
          }}
          aria-label="Close window"
          title="Close"
        >
          ✕
        </button>
      </div>

      <div className="relative h-[calc(100%-38px)] w-full overflow-auto">{children}</div>

      {/* resize handle (右下角) */}
      <div
        className="absolute right-0 bottom-0 h-3 w-3 cursor-nwse-resize"
        onPointerDown={onResizePointerDown}
        aria-hidden="true"
      />
    </section>
  )
}

