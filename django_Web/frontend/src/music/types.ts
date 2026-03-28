export type Track = {
  id: string
  title: string
  audioUrl: string
  lrcUrl?: string
  coverUrl?: string
}

export type LyricLine = {
  time: number
  text: string
}

