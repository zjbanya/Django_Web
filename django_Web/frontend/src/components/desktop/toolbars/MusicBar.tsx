/**
 * 顶部音乐播放栏（纯 UI 演示，无需真实播放）：
 * - 外方内圆容器
 * - 左侧圆形封面，hover 时轻微放大
 * - 中间歌名/艺人可滚动（这里用文本截断即可）
 * - 右侧简化控制按钮
 */
export default function MusicBar() {
  return (
    <div className="h-full p-3">
      <div className="flex h-full items-center justify-center">
        <div className="flex h-full w-full max-w-3xl flex-col justify-center rounded-2xl bg-[#fdf7f4] px-5 py-3">
          <div className="flex items-center gap-4">
            {/* 封面：圆形 + hover 动画 */}
            <div className="relative h-14 w-14 overflow-hidden rounded-full bg-[#f7f0ed] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_26px_rgba(0,0,0,0.10)]">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500/60 via-purple-500/50 to-pink-500/50 transition-transform duration-300 hover:scale-[1.08]" />
            </div>

            {/* 歌曲信息：顶部滚动条（占位实现为 CSS marquee） */}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[#4a4a4a] overflow-hidden whitespace-nowrap">
                <span className="inline-block animate-[marquee_8s_linear_infinite]">
                  Midnight Cursor
                </span>
              </div>
              <div className="mt-0.5 text-xs text-[#4a4a4a]/60 overflow-hidden whitespace-nowrap">
                <span className="inline-block animate-[marquee_10s_linear_infinite]">
                  Synthwave Studio • 01:23
                </span>
              </div>
            </div>

            {/* 控制按钮：播放/暂停 + 后一首 */}
            <div className="flex items-center gap-2">
              <button className="h-10 w-10 rounded-2xl bg-[#f7f0ed] text-[#4a4a4a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(0,0,0,0.07)] hover:bg-[#fbf5f2]">
                ▶
              </button>
              <button className="h-10 w-10 rounded-2xl bg-[#f7f0ed] text-[#4a4a4a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(0,0,0,0.07)] hover:bg-[#fbf5f2]">
                ⏭
              </button>
            </div>
          </div>

          {/* 进度条（占位） */}
          <div className="mt-3 flex items-center gap-3">
            <div className="text-[11px] text-[#4a4a4a]/55">0:32</div>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e6d9d3]">
              <div className="h-full w-[40%] rounded-full bg-[#4a4a4a]/50" />
            </div>
            <div className="text-[11px] text-[#4a4a4a]/55">1:23</div>
          </div>
        </div>
      </div>
    </div>
  )
}


