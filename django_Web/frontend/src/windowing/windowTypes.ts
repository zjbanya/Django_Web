export type AppType = 'blog' | 'settings' | 'music'

export type WindowInstance = {
  id: string
  appType: AppType
  title: string

  x: number
  y: number
  w: number
  h: number

  z: number
}

