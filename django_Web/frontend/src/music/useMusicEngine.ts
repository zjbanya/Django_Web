import { useEffect, useState } from 'react'

import { musicEngine } from './engine'

export function useMusicEngine() {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const unsubscribe = musicEngine.subscribe(() => setVersion((v) => v + 1))
    void musicEngine.ensureInit()
    return () => {
      unsubscribe()
    }
  }, [])

  const state = musicEngine.getState()
  return { state, version, engine: musicEngine }
}

