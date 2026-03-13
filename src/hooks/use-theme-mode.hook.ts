import { useContext } from 'react'
import {
  ThemeContext,
  type ThemeContextValue,
} from '../theme/theme-context-value.ts'

export const useThemeMode = (): ThemeContextValue => useContext(ThemeContext)
