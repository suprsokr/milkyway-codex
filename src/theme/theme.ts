export type ThemeColors = Record<string, string>

export const darkColors: ThemeColors = {
  primary: '#38bdf8',
  primaryHover: '#7dd3fc',
  primaryDark: '#0ea5e9',
  accent: '#f59e0b',
  accentHover: '#fbbf24',
  accentDark: '#d97706',
  bg: '#0f1117',
  bgCard: '#1a1d2b',
  bgElevated: '#242838',
  bgInput: '#151823',
  bgCode: '#161822',
  text: '#e2e8f0',
  textBright: '#f8fafc',
  textMuted: '#94a3b8',
  textGold: '#fbbf24',
  border: '#2d3348',
  borderLight: '#3d4460',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  protected: '#ef4444',
  hwEvent: '#f59e0b',
  luaType: '#c084fc',
  paramType: '#67e8f9',
  returnType: '#86efac',
}

export const lightColors: ThemeColors = {
  primary: '#7c2d12',
  primaryHover: '#9a3412',
  primaryDark: '#611508',
  accent: '#064e73',
  accentHover: '#075985',
  accentDark: '#053d5c',
  bg: '#ece5d8',
  bgCard: '#f5f1e8',
  bgElevated: '#d6ccba',
  bgInput: '#e4dccf',
  bgCode: '#ddd4c5',
  text: '#1a1208',
  textBright: '#0a0702',
  textMuted: '#3a2e20',
  textGold: '#7c2d12',
  border: '#a89878',
  borderLight: '#8a7a5e',
  success: '#145528',
  error: '#7f1d1d',
  warning: '#7c3008',
  protected: '#7f1d1d',
  hwEvent: '#7c3008',
  luaType: '#581c87',
  paramType: '#134e63',
  returnType: '#145528',
}

/** CSS-variable-backed color references — works in any styled-component */
const colorVars = Object.keys(darkColors).reduce(
  (acc, key) => {
    acc[key] = `var(--color-${key})`
    return acc
  },
  {} as ThemeColors,
)

export const theme = {
  colors: colorVars,
  fonts: {
    heading: "'Cinzel', serif",
    body: "'Lora', serif",
    code: "'JetBrains Mono', monospace",
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  sidebar: {
    width: '280px',
    collapsedWidth: '64px',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
  },
} as const

export type Theme = typeof theme
