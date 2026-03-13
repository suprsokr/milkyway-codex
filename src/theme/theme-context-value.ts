import { createContext } from 'react'

export type ThemeMode = 'dark' | 'light'

export interface ThemeContextValue {
  mode: ThemeMode
  toggle: () => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  toggle: () => {},
})
