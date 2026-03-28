import { useDesktop } from '../../../state/DesktopContext'
import { useWindowStore } from '../../../windowing/windowStore'

type AppItem = {
  id: string
  label: string
  icon: 'desktop' | 'blog' | 'settings' | 'music'
  action: () => void
}

function Icon({ name }: { name: AppItem['icon'] }) {
  const common = 'h-5 w-5 text-[#4a4a4a]/85'
  switch (name) {
    case 'desktop':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3.5" y="4" width="17" height="12" rx="2" />
          <path d="M8 20h8" />
          <path d="M12 16v4" />
        </svg>
      )
    case 'blog':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 4h10a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
          <path d="M9 8h8" />
          <path d="M9 12h8" />
          <path d="M9 16h5" />
        </svg>
      )
    case 'settings':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.6 2.7-.1-.1a1.7 1.7 0 0 0-2 .3 1.7 1.7 0 0 0-.9 1.8V23H10v-.2a1.7 1.7 0 0 0-.9-1.8 1.7 1.7 0 0 0-2-.3l-.1.1L5.4 18l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1.1H4V10h.2a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L8 4.2l.1.1a1.7 1.7 0 0 0 2 .3 1.7 1.7 0 0 0 .9-1.8V2h4v.2a1.7 1.7 0 0 0 .9 1.8 1.7 1.7 0 0 0 2-.3l.1-.1 1.6 2.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1.1H20v4h-.2a1.7 1.7 0 0 0-1.4 1Z" />
        </svg>
      )
    case 'music':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V6l12-2v12" />
          <circle cx="7.5" cy="18.5" r="2.5" />
          <circle cx="19.5" cy="16.5" r="2.5" />
        </svg>
      )
    default:
      return null
  }
}

/**
 * 左侧 Applications Dock：
 * - 单列（每行一个应用）
 * - 强调“立体感”：按钮内外色相近但分层明显
 *
 * 扩展方式：
 * - 只需要改 `items` 数组，添加/删除应用即可。
 */
export default function ApplicationsDock() {
  const { accentHue } = useDesktop()
  const { openWindow } = useWindowStore()

  const accentBg = `hsla(${accentHue} 80% 90% / 1)`
  const accentShadow = `hsla(${accentHue} 70% 55% / 0.25)`

  const items: AppItem[] = [
    {
      id: 'desktop',
      label: '',
      icon: 'desktop',
      action: () => { },
    },
    {
      id: 'blog',
      label: '',
      icon: 'blog',
      action: () => openWindow('blog'),
    },
    {
      id: 'settings',
      label: '',
      icon: 'settings',
      action: () => openWindow('settings'),
    },
    {
      id: 'music',
      label: '',
      icon: 'music',
      action: () => openWindow('music'),
    },
  ]

  //  工具栏 root 层 
  return (
    <div className="h-full px-3 py-4 ">
      <div className="px-1 text-[11px] font-semibold tracking-wide text-[#4a4a4a]/70">

      </div>

      <div className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.action}
            className={[
              'group flex w-full items-center gap-2 rounded-xl px-2 py-2',
              // 立体感：外层微暗、内层微亮 + 内阴影
              'bg-[#f7f0ed] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_14px_rgba(0,0,0,0.06)]',
              'transition duration-200 ease-out',
              'hover:translate-y-[-1px] hover:bg-[#fbf5f2] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_22px_rgba(0,0,0,0.08)]',
              'active:translate-y-[0px] active:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.05)]',
            ].join(' ')}
            style={{
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.92), 0 6px 14px rgba(0,0,0,0.06), 0 0 0 1px ${accentShadow}`,
            }}
            title={item.label}
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
              style={{ background: `linear-gradient(180deg, ${accentBg}, #fdf7f4)` }}
            >
              <Icon name={item.icon} />
            </span>
            <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[#4a4a4a]/85">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

