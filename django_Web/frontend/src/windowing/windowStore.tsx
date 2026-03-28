import React, { createContext, useContext, useMemo, useRef, useState } from 'react'

import type { AppType, WindowInstance } from './windowTypes'

type WindowStoreValue = {
  windows: WindowInstance[]
  openWindow: (appType: AppType, opts?: { title?: string }) => string
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  updateWindow: (id: string, patch: Partial<WindowInstance>) => void
  bringToFrontZ: (id: string) => void
}

const WindowStoreContext = createContext<WindowStoreValue | null>(null)

export function WindowStoreProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([])
  // 必须高于 HoverDock（z-35）否则会遮挡/被盖住
  const zMaxRef = useRef(80)

  const openWindow = (appType: AppType, opts?: { title?: string }) => {
    // 同应用只允许一个窗口：已存在就直接置顶
    const existed = windows.find((w) => w.appType === appType)
    if (existed) {
      zMaxRef.current += 1
      setWindows((prev) => prev.map((w) => (w.id === existed.id ? { ...w, z: zMaxRef.current } : w)))
      return existed.id
    }

    const id = `${appType}_${Date.now()}_${Math.random().toString(16).slice(2)}`
    zMaxRef.current += 1

    const next: WindowInstance = {
      id,
      appType,
      title:
        opts?.title ??
        (appType === 'blog' ? 'My Blog' : appType === 'settings' ? 'System Settings' : 'Music'),
      x: 140,
      y: 120,
      w: appType === 'music' ? 720 : 640,
      h: appType === 'music' ? 500 : 460,
      z: zMaxRef.current,
    }

    setWindows((prev) => [...prev, next])
    return id
  }

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }

  const focusWindow = (id: string) => {
    zMaxRef.current += 1
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z: zMaxRef.current } : w)))
  }

  const bringToFrontZ = focusWindow

  const updateWindow = (id: string, patch: Partial<WindowInstance>) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)))
  }

  const value = useMemo<WindowStoreValue>(
    () => ({
      windows,
      openWindow,
      closeWindow,
      focusWindow,
      updateWindow,
      bringToFrontZ,
    }),
    [windows],
  )

  return <WindowStoreContext.Provider value={value}>{children}</WindowStoreContext.Provider>
}

export function useWindowStore() {
  const ctx = useContext(WindowStoreContext)
  if (!ctx) throw new Error('useWindowStore must be used within WindowStoreProvider')
  return ctx
}

