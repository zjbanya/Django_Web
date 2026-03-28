import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

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
  activeWallpaperId: string
  wallpaperIndex: number
  setWallpaperId: (id: string) => void
  loadMoreWallpapers: () => Promise<void>
  hasMoreWallpapers: boolean
  isWallpapersLoading: boolean

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

const WALLPAPER_ID_KEY = 'wallpaper_id'
const ACCENT_HUE_KEY = 'theme_accent_hue'

const PAGE_SIZE = 14

function extractIdFromKey(key: string) {
  return key.split('/').pop() || key
}

export function DesktopProvider({ children }: { children: React.ReactNode }) {
  const modules = useMemo(
    () =>
      import.meta.glob(
        '../assets/wallpaper/*.{png,jpg,jpeg,webp}',
        { import: 'default' }
      ) as Record<string, () => Promise<string>>,
    [],
  )

  const allKeys = useMemo(() => {
    const keys = Object.keys(modules)
    return keys.sort((a, b) => extractIdFromKey(a).localeCompare(extractIdFromKey(b)))
  }, [modules])

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [loadedKeyCount, setLoadedKeyCount] = useState(0)
  const loadedKeyCountRef = useRef(0)

  const [isWallpapersLoading, setIsWallpapersLoading] = useState(false)

  const [activeWallpaperId, setActiveWallpaperIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(WALLPAPER_ID_KEY) || ''
    } catch {
      return ''
    }
  })

  const wallpaperIndex = useMemo(() => {
    if (!activeWallpaperId) return -1
    return wallpapers.findIndex((w) => w.id === activeWallpaperId)
  }, [activeWallpaperId, wallpapers])

  const activeWallpaper = wallpaperIndex >= 0 ? wallpapers[wallpaperIndex] : wallpapers[0]

  const loadSlice = async (start: number, end: number): Promise<Wallpaper[]> => {
    const keys = allKeys.slice(start, end)
    const urls = await Promise.all(keys.map((k) => modules[k]()))

    return urls.map((url, idx) => {
      const key = keys[idx]
      const name = extractIdFromKey(key)
      return { id: name, name, url, thumbUrl: url } satisfies Wallpaper
    })
  }

  const loadMoreWallpapers = async () => {
    if (isWallpapersLoading) return
    if (loadedKeyCountRef.current >= allKeys.length) return

    setIsWallpapersLoading(true)
    try {
      const start = loadedKeyCountRef.current
      const end = Math.min(allKeys.length, start + PAGE_SIZE)
      const items = await loadSlice(start, end)
      setWallpapers((prev) => [...prev, ...items])
      setLoadedKeyCount(end)
      loadedKeyCountRef.current = end
    } finally {
      setIsWallpapersLoading(false)
    }
  }

  const hasMoreWallpapers = loadedKeyCount < allKeys.length

  const ensureWallpaperLoaded = async (id: string) => {
    if (!id) return
    const idx = allKeys.findIndex((k) => extractIdFromKey(k) === id)
    if (idx < 0) return
    const targetEnd = idx + 1
    if (loadedKeyCountRef.current >= targetEnd) return

    setIsWallpapersLoading(true)
    try {
      const start = loadedKeyCountRef.current
      const end = Math.min(allKeys.length, targetEnd)
      const items = await loadSlice(start, end)
      setWallpapers((prev) => [...prev, ...items])
      setLoadedKeyCount(end)
      loadedKeyCountRef.current = end
    } finally {
      setIsWallpapersLoading(false)
    }
  }

  const setWallpaperId = (id: string) => {
    setActiveWallpaperIdState(id)
    try {
      localStorage.setItem(WALLPAPER_ID_KEY, id)
    } catch {
      // ignore
    }
    // 后台异步补齐：确保该 wallpaper 被加载后再切换背景
    void ensureWallpaperLoaded(id)
  }

  useEffect(() => {
    loadedKeyCountRef.current = loadedKeyCount
  }, [loadedKeyCount])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      if (!allKeys.length) return
      setIsWallpapersLoading(true)
      try {
        const storedId = activeWallpaperId || localStorage.getItem(WALLPAPER_ID_KEY) || ''
        const targetIdx = storedId ? allKeys.findIndex((k) => extractIdFromKey(k) === storedId) : -1

        const endCount =
          targetIdx >= 0
            ? Math.min(allKeys.length, Math.max(PAGE_SIZE, targetIdx + 1))
            : Math.min(allKeys.length, PAGE_SIZE)

        const items = await loadSlice(0, endCount)
        if (cancelled) return
        setWallpapers(items)
        setLoadedKeyCount(endCount)
        loadedKeyCountRef.current = endCount

        if (targetIdx >= 0) {
          setActiveWallpaperIdState(storedId)
        } else if (items[0]) {
          setActiveWallpaperIdState(items[0].id)
          try {
            localStorage.setItem(WALLPAPER_ID_KEY, items[0].id)
          } catch {
            // ignore
          }
        }
      } finally {
        if (!cancelled) setIsWallpapersLoading(false)
      }
    }

    void init()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allKeys.length])

  useEffect(() => {
    if (!activeWallpaperId) return
    try {
      localStorage.setItem(WALLPAPER_ID_KEY, activeWallpaperId)
    } catch {
      // ignore
    }
  }, [activeWallpaperId])

  const [accentHue, setAccentHueState] = useState<number>(() => {
    try {
      const v = localStorage.getItem(ACCENT_HUE_KEY)
      const n = v ? Number(v) : NaN
      return Number.isFinite(n) ? n : 255
    } catch {
      return 255
    }
  }) // 蓝紫系默认值

  const [isBlogOpen, setIsBlogOpen] = useState(false)
  const [isTopOpen, setIsTopOpen] = useState(false)
  const [isRightOpen, setIsRightOpen] = useState(false)
  const [isBottomOpen, setIsBottomOpen] = useState(false)
  const [isTopPinned, setIsTopPinned] = useState(false)
  const [isRightPinned, setIsRightPinned] = useState(false)
  const [isBottomPinned, setIsBottomPinned] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(ACCENT_HUE_KEY, String(accentHue))
    } catch {
      // ignore
    }
  }, [accentHue])

  const setAccentHue = (h: number) => setAccentHueState(h)

  const value = useMemo<DesktopContextValue>(
    () => ({
      wallpapers,
      activeWallpaperId: activeWallpaper?.id ?? '',
      wallpaperIndex: wallpaperIndex >= 0 ? wallpaperIndex : 0,
      setWallpaperId,
      loadMoreWallpapers,
      hasMoreWallpapers,
      isWallpapersLoading,
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
      activeWallpaper?.id,
      wallpaperIndex,
      loadMoreWallpapers,
      hasMoreWallpapers,
      isWallpapersLoading,
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

