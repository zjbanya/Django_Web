import { useMusicEngine } from '../../../music/useMusicEngine'

function fmt(sec: number) {
  const s = Math.max(0, Math.floor(sec || 0))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

/**
 * 顶部音乐播放栏（纯 UI 演示，无需真实播放）：
 * - 外方内圆容器
 * - 左侧圆形封面，hover 时轻微放大
 * - 中间歌名/艺人可滚动（这里用文本截断即可）
 * - 右侧简化控制按钮
 */
export default function MusicBar() {
  const { state, engine } = useMusicEngine()
  const current = state.tracks[state.index]

  return (
    <div className="h-full p-3">
      <div className="flex h-full items-center justify-center">
        <div className="flex h-full w-full max-w-3xl flex-col justify-center rounded-2xl bg-[#fdf7f4] px-5 py-3">
          <div className="flex items-center gap-4">
            {/* 封面：圆形 + hover 动画 */}
            <div className="relative h-14 w-14 overflow-hidden rounded-full bg-[#f7f0ed] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_26px_rgba(0,0,0,0.10)]">
              {current?.coverUrl ? (
                <img
                  src={current.coverUrl}
                  alt={current.title}
                  className="h-12 w-12 rounded-full object-cover transition-transform duration-300 hover:scale-[1.08]"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500/60 via-purple-500/50 to-pink-500/50 transition-transform duration-300 hover:scale-[1.08]" />
              )}
            </div>

            {/* 歌曲信息：顶部滚动条（占位实现为 CSS marquee） */}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[#4a4a4a] overflow-hidden whitespace-nowrap">
                <span className="inline-block animate-[marquee_8s_linear_infinite]">
                  {current?.title ?? 'No track loaded'}
                </span>
              </div>
              <div className="mt-0.5 text-xs text-[#4a4a4a]/60 overflow-hidden whitespace-nowrap">
                <span className="inline-block animate-[marquee_10s_linear_infinite]">
                  {state.tracks.length ? `${state.tracks.length} tracks` : 'CloudMusic is empty'}
                </span>
              </div>
            </div>

            {/* 控制按钮：播放/暂停 + 后一首 */}
            <div className="flex items-center gap-2">
              <button
                disabled={state.tracks.length <= 1}
                onClick={() => engine.prev()}
                className="h-10 w-10 rounded-2xl bg-[#f7f0ed] text-[#4a4a4a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(0,0,0,0.07)] hover:bg-[#fbf5f2] disabled:opacity-40"
              >
                ⏮
              </button>
              <button
                disabled={!state.tracks.length}
                onClick={() => engine.togglePlay()}
                className="h-10 w-10 rounded-2xl bg-[#f7f0ed] text-[#4a4a4a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(0,0,0,0.07)] hover:bg-[#fbf5f2] disabled:opacity-40"
              >
                {state.isPlaying ? '⏸' : '▶'}
              </button>
              <button
                disabled={state.tracks.length <= 1}
                onClick={() => engine.next()}
                className="h-10 w-10 rounded-2xl bg-[#f7f0ed] text-[#4a4a4a]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_22px_rgba(0,0,0,0.07)] hover:bg-[#fbf5f2] disabled:opacity-40"
              >
                ⏭
              </button>
            </div>
          </div>

          {/* 进度条（占位） */}
          <div className="mt-3 flex items-center gap-3">
            <div className="text-[11px] text-[#4a4a4a]/55">{fmt(state.currentTime)}</div>
            <input
              type="range"
              min={0}
              max={Math.max(1, state.duration || 0)}
              value={state.currentTime}
              onChange={(e) => engine.seek(Number(e.target.value))}
              className="h-2 flex-1 accent-[#6f6f6f]"
            />
            <div className="text-[11px] text-[#4a4a4a]/55">{fmt(state.duration)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


