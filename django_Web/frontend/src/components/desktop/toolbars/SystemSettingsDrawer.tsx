import { useDesktop } from '../../../state/DesktopContext'

/**
 * 右侧系统设置抽屉式面板（占位 UI）：
 * 只负责展示“系统选项”，不强绑定任何逻辑。
 * 扩展方式：替换 items 中的文案即可。
 */
export default function SystemSettingsDrawer() {
  const { setAccentHue } = useDesktop()
  const items = [
    { icon: '🎛️', title: '主题', desc: '亮/暗/自动（占位）' },
    { icon: '🖼️', title: '壁纸管理', desc: '交给底部轮播（占位）' },
    { icon: '🌐', title: '语言', desc: '中文 / English（占位）' },
    { icon: '🔔', title: '通知设置', desc: '占位开关' },
    { icon: 'ℹ️', title: '关于博客', desc: '版本信息（占位）' },
    { icon: '🧩', title: '开发者', desc: '扩展入口（占位）' },
  ]

  return (
    <div className="h-full p-4">
      <div className="text-sm font-semibold text-white/90">System</div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {items.map((it) => (
          <div
            key={it.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
            role={it.title === '主题' ? 'button' : undefined}
            tabIndex={it.title === '主题' ? 0 : undefined}
            onClick={
              it.title === '主题'
                ? () => setAccentHue(Math.floor(Math.random() * 360))
                : undefined
            }
          >
            <div className="flex items-center gap-2 text-white/80">
              <span className="text-base">{it.icon}</span>
              <span className="text-xs font-semibold">{it.title}</span>
            </div>
            <div className="mt-2 text-[11px] text-white/55">{it.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

