/**
 * 顶部音乐播放栏（纯 UI 演示，无需真实播放）：
 * - 外方内圆容器
 * - 左侧圆形封面，hover 时轻微放大
 * - 中间歌名/艺人可滚动（这里用文本截断即可）
 * - 右侧简化控制按钮
 */
export default function MusicBar() {
  return (
    <div className="h-full p-4">
      <div className="flex h-full items-center justify-center">
        <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md px-5 py-3">
          <div className="flex items-center gap-4">
            {/* 封面：外方内圆 + hover 动画 */}
            <div className="relative h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500/70 via-purple-500/60 to-pink-500/60 transition-transform duration-300 hover:scale-[1.08]" />
            </div>

            {/* 歌曲信息 */}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white/90 truncate">
                Midnight Cursor
              </div>
              <div className="text-xs text-white/60 truncate">
                Synthwave Studio • 01:23
              </div>
            </div>

            {/* 控制按钮：简化 */}
            <div className="flex items-center gap-2">
              <button className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10">
                ▶
              </button>
              <button className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10">
                ⏭
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

