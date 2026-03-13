import { useState, useCallback, type ReactNode } from 'react'
import { ThemeContext, type ThemeMode } from './theme-context-value.ts'

const STORAGE_KEY = 'codex-theme'

function getInitialMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* SSR or private browsing */
  }
  return 'dark'
}

export const ThemeModeProvider = ({
  children,
}: {
  children: ReactNode
}): ReactNode => {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
