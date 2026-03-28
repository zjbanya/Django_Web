import { parseBlob } from 'music-metadata-browser'

import type { LyricLine, Track } from './types'

type Listener = () => void

type State = {
  tracks: Track[]
  index: number
  isPlaying: boolean
  currentTime: number
  duration: number
  search: string
  lyrics: LyricLine[]
  loading: boolean
}

const state: State = {
  tracks: [],
  index: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  search: '',
  lyrics: [],
  loading: false,
}

const audio = new Audio()
const listeners = new Set<Listener>()
const lrcTextMap: Record<string, string> = {}

function emit() {
  listeners.forEach((l) => l())
}

function setState(patch: Partial<State>) {
  Object.assign(state, patch)
  emit()
}

function parseLrc(raw: string): LyricLine[] {
  const lines = raw.split(/\r?\n/)
  const out: LyricLine[] = []
  const re = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\](.*)/
  for (const line of lines) {
    const m = line.match(re)
    if (!m) continue
    const mm = Number(m[1] || 0)
    const ss = Number(m[2] || 0)
    const ms = Number((m[3] || '0').padEnd(3, '0'))
    out.push({ time: mm * 60 + ss + ms / 1000, text: (m[4] || '').trim() })
  }
  return out.sort((a, b) => a.time - b.time)
}

function baseName(path: string) {
  return (path.split('/').pop() || path).replace(/\.(flac|mp3|wav|ogg)$/i, '')
}

async function tryExtractEmbeddedCover(audioUrl: string): Promise<string | undefined> {
  try {
    const res = await fetch(audioUrl)
    const blob = await res.blob()
    const meta = await parseBlob(blob)
    const pic = meta.common.picture?.[0]
    if (!pic?.data || !pic.format) return undefined
    const bytes = pic.data
    let binary = ''
    const chunk = 0x8000
    for (let i = 0; i < bytes.length; i += chunk) {
      const sub = bytes.subarray(i, i + chunk)
      binary += String.fromCharCode(...Array.from(sub))
    }
    const b64 = btoa(binary)
    return `data:${pic.format};base64,${b64}`
  } catch {
    return undefined
  }
}

async function loadTracks() {
  setState({ loading: true })
  try {
    const audioModules = import.meta.glob('../assets/CloudMusic/*.{flac,mp3,wav,ogg}', {
      import: 'default',
    }) as Record<string, () => Promise<string>>

    // 通过 ?raw 读取文本，避免将 .lrc 按 JS 解析导致构建错误
    const lrcModules = import.meta.glob('../assets/CloudMusic/*.lrc?raw', {
      import: 'default',
    }) as Record<string, () => Promise<string>>

    const coverModules = import.meta.glob('../assets/CloudMusic/*.{png,jpg,jpeg,webp}', {
      import: 'default',
    }) as Record<string, () => Promise<string>>

    const audioKeys = Object.keys(audioModules).sort()
    const lrcMap: Record<string, string> = {}
    const coverMap: Record<string, string> = {}

    await Promise.all(
      Object.keys(lrcModules).map(async (k) => {
        const text = await lrcModules[k]()
        const id = baseName(k.replace(/\?raw$/, ''))
        lrcTextMap[id] = text
        lrcMap[id] = `${id}.lrc`
      }),
    )
    await Promise.all(
      Object.keys(coverModules).map(async (k) => {
        const url = await coverModules[k]()
        coverMap[baseName(k)] = url
      }),
    )

    const tracks: Track[] = []
    for (const key of audioKeys) {
      const audioUrl = await audioModules[key]()
      const title = baseName(key)
      const coverUrl = coverMap[title] ?? (await tryExtractEmbeddedCover(audioUrl))
      tracks.push({
        id: title,
        title,
        audioUrl,
        lrcUrl: lrcMap[title],
        coverUrl,
      })
    }

    setState({
      tracks,
      index: 0,
      loading: false,
    })
  } catch {
    setState({ loading: false })
  }
}

async function loadLyricsForCurrent() {
  const t = state.tracks[state.index]
  if (!t?.lrcUrl) {
    setState({ lyrics: [] })
    return
  }
  const raw = lrcTextMap[t.id]
  if (!raw) {
    setState({ lyrics: [] })
    return
  }
  setState({ lyrics: parseLrc(raw) })
}

function playAt(index: number) {
  if (!state.tracks.length) return
  const next = Math.max(0, Math.min(index, state.tracks.length - 1))
  const t = state.tracks[next]
  if (!t) return
  audio.src = t.audioUrl
  audio.play().catch(() => {})
  setState({ index: next, isPlaying: true })
  void loadLyricsForCurrent()
}

audio.addEventListener('timeupdate', () => {
  setState({ currentTime: audio.currentTime || 0 })
})
audio.addEventListener('durationchange', () => {
  setState({ duration: Number.isFinite(audio.duration) ? audio.duration : 0 })
})
audio.addEventListener('play', () => setState({ isPlaying: true }))
audio.addEventListener('pause', () => setState({ isPlaying: false }))
audio.addEventListener('ended', () => {
  if (state.tracks.length <= 1) {
    setState({ isPlaying: false })
    return
  }
  playAt((state.index + 1) % state.tracks.length)
})

let initialized = false

export const musicEngine = {
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getState() {
    return state
  },
  async ensureInit() {
    if (initialized) return
    initialized = true
    await loadTracks()
  },
  setSearch(search: string) {
    setState({ search })
  },
  togglePlay() {
    if (!state.tracks.length) return
    if (!audio.src) {
      playAt(state.index)
      return
    }
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  },
  prev() {
    if (state.tracks.length <= 1) return
    const next = (state.index - 1 + state.tracks.length) % state.tracks.length
    playAt(next)
  },
  next() {
    if (state.tracks.length <= 1) return
    const next = (state.index + 1) % state.tracks.length
    playAt(next)
  },
  selectById(id: string) {
    const i = state.tracks.findIndex((t) => t.id === id)
    if (i < 0) return
    playAt(i)
  },
  seek(time: number) {
    if (!audio.src) return
    const t = Math.max(0, Math.min(time, state.duration || 0))
    audio.currentTime = t
    setState({ currentTime: t })
  },
}

