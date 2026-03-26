import { useDesktop } from '../../../state/DesktopContext'

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

/**
 * 右侧系统设置抽屉式面板（占位 UI）：
 * 只负责展示“系统选项”，不强绑定任何逻辑。
 * 扩展方式：替换 items 中的文案即可。
 */
export default function SystemSettingsDrawer() {
  const { setAccentHue } = useDesktop()
  const items = [
    { icon: 'theme' as const, title: 'Theme', desc: 'Light / Dark / Auto (placeholder)' },
    { icon: 'wallpaper' as const, title: 'Wallpaper', desc: 'Use bottom carousel (placeholder)' },
    { icon: 'language' as const, title: 'Language', desc: '中文 / English (placeholder)' },
    { icon: 'notifications' as const, title: 'Notifications', desc: 'Toggle switches (placeholder)' },
    { icon: 'about' as const, title: 'About', desc: 'Version info (placeholder)' },
  ]

  return (
    <div className="h-full p-3">
      <div className="h-full rounded-lg border border-[#e6d9d3] bg-[#fdf7f4] p-3">
        <div className="text-sm font-semibold text-[#4a4a4a]">System Settings</div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-lg border border-[#e6d9d3] bg-white p-3"
              role={it.title === 'Theme' ? 'button' : undefined}
              tabIndex={it.title === 'Theme' ? 0 : undefined}
              onClick={
                it.title === 'Theme' ? () => setAccentHue(Math.floor(Math.random() * 360)) : undefined
              }
            >
              <div className="flex items-center gap-2 text-[#4a4a4a]/80">
                <MiniIcon name={it.icon} />
                <span className="text-xs font-semibold">{it.title}</span>
              </div>
              <div className="mt-2 text-[11px] text-[#4a4a4a]/55">{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

