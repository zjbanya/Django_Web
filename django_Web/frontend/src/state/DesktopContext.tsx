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

  openToolbars: Partial<Record<ToolbarKey, boolean>>
  setOpenToolbar: (key: ToolbarKey, open: boolean) => void

  accentHue: number
  setAccentHue: (h: number) => void

  activeApp: ActiveApp
  setActiveApp: (app: ActiveApp) => void
}

const DesktopContext = createContext<DesktopContextValue | null>(null)

const MAX_WALLPAPERS = 9

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

  const [openToolbars, setOpenToolbars] = useState<Partial<Record<ToolbarKey, boolean>>>(
    {}
  )
  const setOpenToolbar = (key: ToolbarKey, open: boolean) => {
    setOpenToolbars((prev) => ({ ...prev, [key]: open }))
  }

  const [accentHue, setAccentHue] = useState(255) // 蓝紫系默认值
  const [activeApp, setActiveApp] = useState<ActiveApp>('blog')

  const value = useMemo<DesktopContextValue>(
    () => ({
      wallpapers,
      wallpaperIndex,
      setWallpaperIndex,
      openToolbars,
      setOpenToolbar,
      accentHue,
      setAccentHue,
      activeApp,
      setActiveApp,
    }),
    [wallpapers, wallpaperIndex, openToolbars, accentHue, activeApp]
  )

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>
}

export function useDesktop() {
  const ctx = useContext(DesktopContext)
  if (!ctx) throw new Error('useDesktop must be used within DesktopProvider')
  return ctx
}

