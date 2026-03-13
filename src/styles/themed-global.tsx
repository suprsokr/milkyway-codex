import type { ReactNode } from 'react'
import { GlobalStyle } from './global.ts'
import { useThemeMode } from '../hooks/use-theme-mode.hook.ts'

export const ThemedGlobalStyle = (): ReactNode => {
  const { mode } = useThemeMode()
  return <GlobalStyle $mode={mode} />
}
