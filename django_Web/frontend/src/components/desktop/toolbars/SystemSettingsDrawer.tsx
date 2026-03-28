import { useEffect, useMemo, useState } from 'react'

import { useDesktop } from '../../../state/DesktopContext'
import { useWindowStore } from '../../../windowing/windowStore'

function MiniIcon({ name }: { name: 'theme' | 'wallpaper' | 'language' | 'notifications' | 'about' }) {
  const common = 'h-5 w-5 text-[#4a4a4a]'
  switch (name) {
    case 'theme':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.9 4.9l1.4 1.4" />
          <path d="M17.7 17.7l1.4 1.4" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M4.9 19.1l1.4-1.4" />
          <path d="M17.7 6.3l1.4-1.4" />
        </svg>
      )
    case 'wallpaper':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3.5" y="4" width="17" height="15" rx="2" />
          <path d="M6 18l3-4 3 2 3-4 2 2" />
        </svg>
      )
    case 'language':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 5h16" />
          <path d="M7 9c1.2 3 3.6 6 7 8" />
          <path d="M7 17c2-1 4-3 5-5" />
        </svg>
      )
    case 'notifications':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
      )
    case 'about':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v6" />
          <path d="M12 8h.01" />
        </svg>
      )
    default:
      return null
  }
}

type ModalProps = {
  open: boolean
  title: string
  body: string
  onClose: () => void
}

function Modal({ open, title, body, onClose }: ModalProps) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#e6d9d3] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-semibold text-[#4a4a4a]">{title}</div>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-xs font-semibold text-[#4a4a4a] hover:bg-[#fdf7f4]"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="px-4 pb-4 text-sm text-[#4a4a4a]/70">{body}</div>
      </div>
    </div>
  )
}

/**
 * 右侧系统设置抽屉式面板（占位 UI）：
 * - 单列（每行一个按钮）
 * - 顶部展示头像 + 昵称（可编辑输入框）
 * - 点击按钮弹窗，用于测试交互
 */
export default function SystemSettingsDrawer() {
  const { setAccentHue } = useDesktop()
  const { openWindow } = useWindowStore()
  const [modal, setModal] = useState<{ title: string; body: string } | null>(null)

  const AVATAR_PRESET_KEY = 'avatar_key'
  const AVATAR_UPLOAD_DATA_URL_KEY = 'avatar_upload_data_url'
  const AVATAR_PRESETS_LIMIT = 24

  const username = useMemo(() => localStorage.getItem('username') || 'Guest', [])
  const [displayName, setDisplayName] = useState<string>('')

  const avatarModules = useMemo(
    () =>
      import.meta.glob('../../../assets/Emoji/**/*.{png,jpg,jpeg,webp}', { import: 'default' }) as Record<
        string,
        () => Promise<string>
      >,
    [],
  )

  const [presetAvatars, setPresetAvatars] = useState<{ key: string; url: string }[]>([])
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false)

  const [avatarKey, setAvatarKey] = useState<string>(() => localStorage.getItem(AVATAR_PRESET_KEY) || '')
  const [avatarUploadDataUrl, setAvatarUploadDataUrl] = useState<string>(
    () => localStorage.getItem(AVATAR_UPLOAD_DATA_URL_KEY) || '',
  )

  useEffect(() => {
    const saved = localStorage.getItem('display_name')
    setDisplayName(saved || username)
  }, [username])

  useEffect(() => {
    if (!displayName) return
    localStorage.setItem('display_name', displayName)
  }, [displayName])

  useEffect(() => {
    let cancelled = false
    const loadPresets = async () => {
      const keys = Object.keys(avatarModules)
        .sort()
        .slice(0, AVATAR_PRESETS_LIMIT)
      const urls = await Promise.all(keys.map((k) => avatarModules[k]()))
      if (cancelled) return
      const mapped = keys.map((k, idx) => {
        const key = k.split('/').pop() || k
        return { key, url: urls[idx] }
      })
      setPresetAvatars(mapped)
    }
    void loadPresets()
    return () => {
      cancelled = true
    }
  }, [avatarModules])

  const avatarSrc = useMemo(() => {
    if (avatarUploadDataUrl) return avatarUploadDataUrl
    if (!avatarKey) return ''
    return presetAvatars.find((p) => p.key === avatarKey)?.url ?? ''
  }, [avatarKey, avatarUploadDataUrl, presetAvatars])

  const items = [
    {
      icon: 'theme' as const,
      title: 'Theme',
      onClick: () => {
        setAccentHue(Math.floor(Math.random() * 360))
        setModal({ title: 'Theme', body: 'Accent hue randomized (prototype).' })
      },
    },
    {
      icon: 'notifications' as const,
      title: 'Notifications',
      onClick: () => setModal({ title: 'Notifications', body: 'Notification settings (prototype).' }),
    },
    {
      icon: 'wallpaper' as const,
      title: 'Wallpaper',
      onClick: () => setModal({ title: 'Wallpaper', body: 'Use bottom wallpaper carousel.' }),
    },
    {
      icon: 'language' as const,
      title: 'Settings',
      onClick: () => {
        setModal(null)
        openWindow('settings')
      },
    },
    {
      icon: 'about' as const,
      title: 'About',
      onClick: () => setModal({ title: 'About', body: 'Desktop shell prototype v1.' }),
    },
  ]

  return (
    <div className="relative h-full p-4">
      <div className="text-sm font-semibold text-[#4a4a4a]">System</div>

      {/* Profile */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-[#f7f0ed] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_20px_rgba(0,0,0,0.08)]"
          onClick={() => setAvatarPickerOpen(true)}
          aria-label="选择头像"
        >
          {avatarSrc ? (
            <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#fdf7f4] via-[#f7f0ed] to-[#efe3dd]" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold text-[#4a4a4a]/55">Signed in</div>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#e6d9d3] bg-white px-3 py-2 text-xs font-semibold text-[#4a4a4a] outline-none focus:ring-2 focus:ring-[#e6d9d3]"
            aria-label="Display name"
          />
        </div>
      </div>

      {/* Actions (single column) */}
      <div className="mt-4 flex flex-col gap-2">
        {items.map((it) => (
          <button
            key={it.title}
            type="button"
            onClick={it.onClick}
            className={[
              'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left',
              'bg-[#f7f0ed] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(0,0,0,0.07)]',
              'transition duration-200 ease-out hover:translate-y-[-1px] hover:bg-[#fbf5f2]',
              'active:translate-y-[0px]',
            ].join(' ')}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fdf7f4] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <MiniIcon name={it.icon} />
            </span>
            <span className="text-xs font-semibold text-[#4a4a4a]/85">{it.title}</span>
          </button>
        ))}
      </div>

      <Modal
        open={Boolean(modal)}
        title={modal?.title ?? ''}
        body={modal?.body ?? ''}
        onClose={() => setModal(null)}
      />

      {/* Avatar picker modal */}
      {avatarPickerOpen ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#e6d9d3] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <div className="flex items-center justify-between border-b border-[#e6d9d3] px-4 py-3">
              <div className="text-sm font-semibold text-[#4a4a4a]">Avatar</div>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-xs font-semibold text-[#4a4a4a] hover:bg-[#fdf7f4]"
                onClick={() => setAvatarPickerOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="p-4">
              <div className="text-xs font-semibold text-[#4a4a4a]">预设头像</div>
              <div className="mt-2 grid grid-cols-6 gap-2">
                {presetAvatars.map((p) => {
                  const active = p.key === avatarKey && !avatarUploadDataUrl
                  return (
                    <button
                      key={p.key}
                      type="button"
                      className={[
                        'h-10 w-10 overflow-hidden rounded-xl border transition',
                        active ? 'border-[#4a4a4a]/35 ring-2 ring-[#e6d9d3]' : 'border-[#e6d9d3]/80',
                      ].join(' ')}
                      onClick={() => {
                        setAvatarKey(p.key)
                        setAvatarUploadDataUrl('')
                        localStorage.setItem(AVATAR_PRESET_KEY, p.key)
                        localStorage.removeItem(AVATAR_UPLOAD_DATA_URL_KEY)
                        setAvatarPickerOpen(false)
                      }}
                      aria-label={`avatar ${p.key}`}
                    >
                      <img src={p.url} alt={p.key} className="h-full w-full object-cover" />
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 text-xs font-semibold text-[#4a4a4a]">上传本地图片（prototype）</div>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  className="text-xs"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => {
                      const dataUrl = String(reader.result || '')
                      setAvatarUploadDataUrl(dataUrl)
                      setAvatarKey('')
                      localStorage.setItem(AVATAR_UPLOAD_DATA_URL_KEY, dataUrl)
                      localStorage.removeItem(AVATAR_PRESET_KEY)
                      setAvatarPickerOpen(false)
                    }
                    reader.readAsDataURL(file)
                  }}
                />
              </div>
              <div className="mt-2 text-[11px] text-[#4a4a4a]/60">
                本地预览已持久化（localStorage dataURL）。后续接入后端上传接口时可替换为真实 URL 同步。
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

