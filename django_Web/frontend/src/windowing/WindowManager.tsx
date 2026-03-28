import { useMemo } from 'react'

import { useWindowStore } from './windowStore'
import DraggableResizableWindow from './DraggableResizableWindow'
import type { AppType } from './windowTypes'

import BlogWindowContent from '../components/desktop/windows/BlogWindowContent'
import SettingsWindowContent from '../components/desktop/windows/SettingsWindowContent'
import MusicWindowContent from '../components/desktop/windows/MusicWindowContent'

type Props = {
  bounds?: { left: number; top: number; right: number; bottom: number }
}

function renderContent(appType: AppType) {
  switch (appType) {
    case 'blog':
      return <BlogWindowContent />
    case 'settings':
      return <SettingsWindowContent />
    case 'music':
      return <MusicWindowContent />
    default:
      return null
  }
}

export default function WindowManager({ bounds }: Props) {
  const { windows } = useWindowStore()

  // bounds 对象在外部如不断变化，可在这里 memo 以减少重渲染
  const stableBounds = useMemo(() => bounds, [bounds])

  return (
    <>
      {windows
        .slice()
        .sort((a, b) => a.z - b.z)
        .map((w) => (
          <DraggableResizableWindow
            key={w.id}
            window={w}
            bounds={stableBounds}
          >
            {renderContent(w.appType)}
          </DraggableResizableWindow>
        ))}
    </>
  )
}

