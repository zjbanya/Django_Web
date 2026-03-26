import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ToolbarKey = 'applications' | 'music' | 'system' | 'wallpapers'
export type ActiveApp = 'blog' | null

export type Wallpaper = {
  id: string
  name: string
  url: string
  thumbUrl: string
}

export type DesktopContextValue = {
  wallpapers: Wallpaper[]
  wallpaperIndex: number
  setWallpaperIndex: (index: number) => void

  accentHue: number
  setAccentHue: (h: number) => void

  // 仅中间壁纸区域：工具栏默认隐藏/悬停展开
  isTopOpen: boolean
  setIsTopOpen: (open: boolean) => void
  isRightOpen: boolean
  setIsRightOpen: (open: boolean) => void
  isBottomOpen: boolean
  setIsBottomOpen: (open: boolean) => void

  // Dock pin：双击后固定展开（再次双击取消固定）
  isTopPinned: boolean
  setIsTopPinned: (pinned: boolean) => void
  isRightPinned: boolean
  setIsRightPinned: (pinned: boolean) => void
  isBottomPinned: boolean
  setIsBottomPinned: (pinned: boolean) => void

  // BlogWindow：由左侧 Dock 点击控制
  isBlogOpen: boolean
  setIsBlogOpen: (open: boolean) => void
}

const DesktopContext = createContext<DesktopContextValue | null>(null)

const MAX_WALLPAPERS = 48

async function loadWallpapers(): Promise<Wallpaper[]> {
  // 非 eager：避免把所有壁纸都打包进来
  // 只加载“排序后前 MAX_WALLPAPERS 个 key”
  const modules = import.meta.glob(
    '../assets/wallpaper/*.{png,jpg,jpeg,webp}',
    { import: 'default' }
  ) as Record<string, () => Promise<string>>

  const keys = Object.keys(modules).sort((a, b) => {
    const aId = a.split('/').pop() || a
    const bId = b.split('/').pop() || b
    return aId.localeCompare(bId)
  })

  const selected = keys.slice(0, MAX_WALLPAPERS)

  const urls = await Promise.all(selected.map((k) => modules[k]()))

  return urls.map((url, idx) => {
    const path = selected[idx]
    const name = path.split('/').pop() || 'wallpaper'
    return { id: name, name, url, thumbUrl: url } satisfies Wallpaper
  })
}

export function DesktopProvider({ children }: { children: React.ReactNode }) {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])

  const [wallpaperIndex, setWallpaperIndexState] = useState(0)
  const setWallpaperIndex = (index: number) => {
    setWallpaperIndexState((prev) => {
      if (wallpapers.length === 0) return prev
      const next = Math.max(0, Math.min(index, wallpapers.length - 1))
      return next
    })
  }

  useEffect(() => {
    let cancelled = false
    loadWallpapers()
      .then((items) => {
        if (cancelled) return
        setWallpapers(items)
        setWallpaperIndexState((prev) => {
          if (items.length === 0) return prev
          return Math.max(0, Math.min(prev, items.length - 1))
        })
      })
      .catch(() => {
        // 原型兜底：加载失败则保持空数组
      })
    return () => {
      cancelled = true
    }
  }, [])

  const [accentHue, setAccentHue] = useState(255) // 蓝紫系默认值
  const [isBlogOpen, setIsBlogOpen] = useState(false)
  const [isTopOpen, setIsTopOpen] = useState(false)
  const [isRightOpen, setIsRightOpen] = useState(false)
  const [isBottomOpen, setIsBottomOpen] = useState(false)
  const [isTopPinned, setIsTopPinned] = useState(false)
  const [isRightPinned, setIsRightPinned] = useState(false)
  const [isBottomPinned, setIsBottomPinned] = useState(false)

  const value = useMemo<DesktopContextValue>(
    () => ({
      wallpapers,
      wallpaperIndex,
      setWallpaperIndex,
      accentHue,
      setAccentHue,
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
      isBlogOpen,
      setIsBlogOpen,
    }),
    [
      wallpapers,
      wallpaperIndex,
      accentHue,
      isTopOpen,
      isRightOpen,
      isBottomOpen,
      isTopPinned,
      isRightPinned,
      isBottomPinned,
      isBlogOpen,
    ]
  )

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
}

export function useDesktop() {
  const ctx = useContext(DesktopContext)
  if (!ctx) throw new Error('useDesktop must be used within DesktopProvider')
  return ctx
}

