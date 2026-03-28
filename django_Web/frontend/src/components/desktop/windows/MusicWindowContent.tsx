import { useMemo } from 'react'

import { useMusicEngine } from '../../../music/useMusicEngine'

/**
 * MusicWindowContent：
 * 先搭窗口内容骨架（音频引擎与封面/歌词解析后续再对齐你的 assets 目录实际结构）。
 * 目前目标：满足“独立可拖拽窗口 + 下一步可扩展音乐播放引擎”。
 */
export default function MusicWindowContent() {
  const { state, engine } = useMusicEngine()
  const current = state.tracks[state.index]

  const filtered = useMemo(() => {
    const q = state.search.trim().toLowerCase()
    if (!q) return state.tracks
    return state.tracks.filter((t) => t.title.toLowerCase().includes(q))
  }, [state.search, state.tracks])

  const activeLyricIndex = useMemo(() => {
    if (!state.lyrics.length) return -1
    for (let i = state.lyrics.length - 1; i >= 0; i -= 1) {
      if (state.currentTime >= state.lyrics[i].time) return i
    }
    return -1
  }, [state.currentTime, state.lyrics])

  return (
    <div className="h-full w-full p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[#4a4a4a]">Music</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => engine.prev()}
            disabled={state.tracks.length <= 1}
            className="rounded-xl bg-[#f7f0ed] px-3 py-1 text-xs font-semibold text-[#4a4a4a] disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => engine.togglePlay()}
            disabled={!state.tracks.length}
            className="rounded-xl bg-[#f7f0ed] px-3 py-1 text-xs font-semibold text-[#4a4a4a] disabled:opacity-40"
          >
            {state.isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => engine.next()}
            disabled={state.tracks.length <= 1}
            className="rounded-xl bg-[#f7f0ed] px-3 py-1 text-xs font-semibold text-[#4a4a4a] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[260px_1fr] gap-4">
        <div className="space-y-3">
          <input
            value={state.search}
            onChange={(e) => engine.setSearch(e.target.value)}
            placeholder="搜索歌曲..."
            className="w-full rounded-xl border border-[#e6d9d3] bg-white px-3 py-2 text-xs font-semibold text-[#4a4a4a] outline-none"
          />

          <div className="h-[300px] overflow-auto space-y-2">
            {filtered.map((t) => {
              const active = current?.id === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => engine.selectById(t.id)}
                  className={[
                    'w-full rounded-xl border px-3 py-2 text-left text-xs',
                    active
                      ? 'border-[#4a4a4a]/30 bg-[#f7f0ed] font-semibold text-[#4a4a4a]'
                      : 'border-[#e6d9d3] bg-white text-[#4a4a4a]/80',
                  ].join(' ')}
                >
                  <div className="truncate">{t.title}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#e6d9d3] bg-[#fdf7f4] p-4">
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 overflow-hidden rounded-2xl bg-white">
              {current?.coverUrl ? (
                <img src={current.coverUrl} alt={current.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200" />
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-[#4a4a4a]">{current?.title ?? 'No track'}</div>
              <div className="mt-1 text-xs text-[#4a4a4a]/65">{state.tracks.length} tracks</div>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="range"
              min={0}
              max={Math.max(1, state.duration || 0)}
              value={state.currentTime}
              onChange={(e) => engine.seek(Number(e.target.value))}
              className="w-full accent-[#6f6f6f]"
            />
            <div className="mt-1 text-[11px] text-[#4a4a4a]/60">
              {Math.floor(state.currentTime)} / {Math.floor(state.duration)}
            </div>
          </div>

          <div className="mt-4 h-[150px] overflow-auto rounded-xl border border-[#e6d9d3] bg-white p-3">
            {state.lyrics.length === 0 ? (
              <div className="text-xs text-[#4a4a4a]/60">No lyrics (.lrc)</div>
            ) : (
              <div className="space-y-1">
                {state.lyrics.map((line, idx) => (
                  <div
                    key={`${line.time}-${idx}`}
                    className={[
                      'text-xs transition',
                      idx === activeLyricIndex ? 'text-[#4a4a4a] font-semibold' : 'text-[#4a4a4a]/55',
                    ].join(' ')}
                  >
                    {line.text || '...'}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {state.loading ? <div className="mt-3 text-xs text-[#4a4a4a]/70">加载音乐资源中...</div> : null}
      {!state.loading && state.tracks.length === 0 ? (
        <div className="mt-3 text-xs text-[#4a4a4a]/70">
          未在 `src/assets/CloudMusic` 发现音频文件。你放入 `.flac/.mp3/.wav` 后会自动识别。
        </div>
      ) : null}
    </div>
  )
}

