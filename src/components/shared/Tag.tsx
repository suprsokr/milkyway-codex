import type { ReactNode } from 'react'
import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'
import { Tooltip } from './Tooltip.tsx'

type TagVariant = 'default' | 'danger' | 'warning' | 'category' | 'type' | 'info' | 'muted'

interface TagProps {
  label: string
  variant?: TagVariant
  onClick?: () => void
}

const VARIANT_COLORS: Record<TagVariant, { bg: string; text: string; border: string }> = {
  default: { bg: theme.colors.bgElevated, text: theme.colors.textMuted, border: theme.colors.border },
  danger: { bg: 'rgba(239, 68, 68, 0.1)', text: theme.colors.protected, border: 'rgba(239, 68, 68, 0.3)' },
  warning: { bg: 'rgba(245, 158, 11, 0.1)', text: theme.colors.hwEvent, border: 'rgba(245, 158, 11, 0.3)' },
  category: { bg: 'rgba(56, 189, 248, 0.1)', text: theme.colors.primary, border: 'rgba(56, 189, 248, 0.3)' },
  type: { bg: 'rgba(192, 132, 252, 0.1)', text: theme.colors.luaType, border: 'rgba(192, 132, 252, 0.3)' },
  info: { bg: 'rgba(134, 239, 172, 0.1)', text: theme.colors.returnType, border: 'rgba(134, 239, 172, 0.3)' },
  muted: { bg: 'rgba(148, 163, 184, 0.06)', text: theme.colors.textMuted, border: 'rgba(148, 163, 184, 0.2)' },
}

const FLAG_DESCRIPTIONS: Record<string, string> = {
  protected: 'Protected — can only be called by the Blizzard user interface.',
  hardware: 'Requires a key or mouse press to be used, but may not be protected.',
  nocombat: 'Cannot be called during combat.',
  blizzardui: 'Lua function declared in Blizzard\'s default user interface, not a C API.',
  framexml: 'Defined by the default user interface in Lua (FrameXML).',
  deprecated: 'Deprecated — no longer in use.',
  internal: 'Blizzard internal function, does nothing in the standard client.',
  luaapi: 'Defined in the Lua standard libraries.',
  maconly: 'Designed for the Mac OS X client only.',
  confirmation: 'Does not prompt for confirmation — the default UI handles that.',
  server: 'Must request data from the server.',
  review: 'Documentation needs review for accuracy.',
}

const FLAG_VARIANTS: Record<string, TagVariant> = {
  protected: 'danger',
  nocombat: 'danger',
  hardware: 'warning',
  confirmation: 'warning',
  deprecated: 'muted',
  internal: 'muted',
  review: 'muted',
  blizzardui: 'info',
  framexml: 'info',
  luaapi: 'info',
  maconly: 'type',
  server: 'default',
}

export const getTagVariant = (label: string): TagVariant => {
  return FLAG_VARIANTS[label.toLowerCase()] ?? 'default'
}

export const Tag = ({ label, variant, onClick }: TagProps): ReactNode => {
  const resolvedVariant = variant ?? getTagVariant(label)
  const colors = VARIANT_COLORS[resolvedVariant]
  const tooltip = FLAG_DESCRIPTIONS[label.toLowerCase()]

  const tag = (
    <StyledTag
      $bg={colors.bg}
      $color={colors.text}
      $border={colors.border}
      $clickable={!!onClick}
      onClick={onClick}
    >
      {label}
    </StyledTag>
  )

  if (tooltip) {
    return <Tooltip text={tooltip}>{tag}</Tooltip>
  }

  return tag
}

const StyledTag = styled.span<{
  $bg: string
  $color: string
  $border: string
  $clickable: boolean
}>`
  display: inline-flex;
  align-items: center;
  font-family: ${theme.fonts.code};
  font-size: 11px;
  padding: 2px 8px;
  border-radius: ${theme.radius.sm};
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  border: 1px solid ${(p) => p.$border};
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  transition: all 0.15s ease;
  white-space: nowrap;

  ${(p) =>
    p.$clickable &&
    `
    &:hover {
      filter: brightness(1.2);
    }
  `}
`
