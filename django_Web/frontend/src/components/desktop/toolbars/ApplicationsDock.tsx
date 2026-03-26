import { useDesktop } from '../../../state/DesktopContext'

type AppItem = {
  id: string
  label: string
  icon: string
  action: () => void
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
  const { setActiveApp } = useDesktop()

  const items: AppItem[] = [
    {
      id: 'blog',
      label: '博客',
      icon: '🗒️',
      action: () => setActiveApp('blog'),
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: '🐙',
      action: () => window.open('https://github.com/', '_blank', 'noopener,noreferrer'),
    },
    {
      id: 'twitter',
      label: 'Twitter/X',
      icon: '𝕏',
      action: () => window.open('https://x.com/', '_blank', 'noopener,noreferrer'),
    },
    {
      id: 'archive',
      label: '归档',
      icon: '🗂️',
      action: () => {
        // 占位：后续可以打开归档窗口
      },
    },
  ]

  // 2 行：grid-rows-2 + grid-flow-col
  const columns = Math.ceil(items.length / 2)

  return (
    <div className="h-full p-3">
      <div className="text-xs font-semibold text-white/70">Applications</div>

      <div
        className="mt-3 grid grid-flow-col grid-rows-2 gap-3"
        style={{ gridAutoColumns: 'min-content', gridAutoFlow: 'column' }}
      >
        {Array.from({ length: columns }).flatMap((_, col) =>
          [0, 1].map((row) => {
            const index = col * 2 + row
            const item = items[index]
            if (!item) return <div key={`empty-${col}-${row}`} />

            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-base text-white/80 backdrop-blur-sm transition hover:scale-[1.06] hover:bg-white/10"
                title={item.label}
              >
                <span className="select-none transition group-hover:filter group-hover:brightness-110">
                  {item.icon}
                </span>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

