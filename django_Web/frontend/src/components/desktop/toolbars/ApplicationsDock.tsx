import { useDesktop } from '../../../state/DesktopContext'

type AppItem = {
  id: string
  label: string
  icon: 'desktop' | 'blog' | 'settings' | 'music' | 'files' | 'terminal' | 'network' | 'power'
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
    case 'files':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 3h7l3 3v15H7V3Z" />
          <path d="M14 3v4h4" />
        </svg>
      )
    case 'terminal':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <path d="M7 9l3 3-3 3" />
          <path d="M12 15h5" />
        </svg>
      )
    case 'network':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="7" cy="7" r="2.5" />
          <circle cx="17" cy="7" r="2.5" />
          <circle cx="12" cy="17" r="2.5" />
          <path d="M9.2 8.4l2 6.2" />
          <path d="M14.8 8.4L12.8 14.6" />
          <path d="M9.2 8.4L7 7" />
        </svg>
      )
    case 'power':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v10" />
          <path d="M6.2 5.8a9 9 0 1 0 11.6 0" />
        </svg>
      )
    default:
      return null
  }
}

/**
 * 左侧 Applications Dock：
 * - 2 行网格（每列最多两个图标），多余向下换列（auto-flow-col）
 * - 点击图标激活“博客窗口”或打开外部链接（占位）
 *
 * 扩展方式：
 * - 只需要改 `items` 数组，添加/删除应用即可。
 */
export default function ApplicationsDock() {
  const { setIsBlogOpen } = useDesktop()

  const items: AppItem[] = [
    {
      id: 'desktop',
      label: 'Desktop',
      icon: 'desktop',
      action: () => {
        // 作为占位：后续可打开桌面/文件管理窗口
      },
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: 'blog',
      action: () => setIsBlogOpen(true),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      action: () => {
        // 右侧抽屉（Theme/Wallpaper/...）目前为占位：靠边缘 hover 打开
      },
    },
    {
      id: 'music',
      label: 'Music',
      icon: 'music',
      action: () => {
        // 作为占位：音乐栏通过顶部边缘 hover 展开
      },
    },
    {
      id: 'files',
      label: 'Files',
      icon: 'files',
      action: () => {
        // 占位：后续可打开文件窗口
      },
    },
    {
      id: 'terminal',
      label: 'Terminal',
      icon: 'terminal',
      action: () => {
        // 占位：后续可打开终端窗口
      },
    },
    {
      id: 'network',
      label: 'Network',
      icon: 'network',
      action: () => {
        // 占位：后续可打开网络窗口
      },
    },
    {
      id: 'power',
      label: 'Power',
      icon: 'power',
      action: () => {
        // 占位：后续可做关机/重启等交互
      },
    },
  ]

  // 每“竖列”最多两个图标；列组向下换行（避免竖栏太宽导致视觉不是按列排）
  const maxIconsPerColumn = 2
  const verticalColumns = Array.from(
    { length: Math.ceil(items.length / maxIconsPerColumn) },
    (_, colIdx) => items.slice(colIdx * maxIconsPerColumn, (colIdx + 1) * maxIconsPerColumn),
  )

  return (
    <div className="h-full p-3">
      <div className="text-xs font-semibold text-[#4a4a4a]/80">Applications</div>

      {/* 列组向下换行，保证每列最多两个图标 */}
      <div className="mt-3 grid grid-cols-2 gap-x-1 gap-y-2">
        {verticalColumns.map((colItems, groupIdx) => {
          // groupIdx 顺序：col0..colN，CSS grid 会自动按“行”向下换组
          const key = `${groupIdx}`
          return (
            <div key={key} className="flex flex-col gap-1">
              {Array.from({ length: maxIconsPerColumn }).map((_, idxInCol) => {
                const item = colItems[idxInCol]
                if (!item) return <div key={`${key}-empty-${idxInCol}`} className="h-8 w-8" />

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    className="group flex h-8 w-8 items-center justify-center rounded-lg border border-[#e6d9d3] bg-[#fdf7f4] transition hover:scale-[1.05] hover:bg-white/60"
                    title={item.label}
                  >
                    <span className="select-none transition group-hover:filter group-hover:saturate-110">
                      <Icon name={item.icon} />
                    </span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* 整体宽度由 DesktopShell 左侧 aside 控制，这里不再额外套 card 以免挤压布局 */}
    </div>
  )
}

