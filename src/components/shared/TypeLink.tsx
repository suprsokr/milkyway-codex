import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'
import { DATA_TYPES } from '../../data/data-types.ts'
import { WIDGETS } from '../../data/widgets.ts'

const dataTypeNames = new Set(DATA_TYPES.map((t) => t.name.toLowerCase()))
const widgetNames = new Set(WIDGETS.map((w) => w.name.toLowerCase()))

export const TypeLink = ({ type }: { type: string }): ReactNode => {
  const lower = type.toLowerCase()

  // Check for exact match or comma-separated types
  const parts = type.split(/,\s*/)
  if (parts.length > 1) {
    return (
      <>
        {parts.map((part, i) => (
          <span key={i}>
            {i > 0 && ', '}
            <TypeLink type={part.trim()} />
          </span>
        ))}
      </>
    )
  }

  if (widgetNames.has(lower)) {
    return <TypeAnchor to={`/widgets/${type}`}>{type}</TypeAnchor>
  }

  if (dataTypeNames.has(lower)) {
    return <TypeAnchor to={`/data-types#${type}`}>{type}</TypeAnchor>
  }

  // Primitives — no link
  const primitives = ['string', 'number', 'boolean', 'nil', 'table', 'function', '—']
  if (primitives.includes(lower)) {
    return <>{type}</>
  }

  // Fallback: check if any known type is contained within (e.g. "unitId or nil")
  for (const dt of dataTypeNames) {
    if (lower.includes(dt) && dt.length > 3) {
      return <TypeAnchor to={`/data-types#${dt}`}>{type}</TypeAnchor>
    }
  }

  return <>{type}</>
}

const TypeAnchor = styled(Link)`
  color: ${theme.colors.luaType};
  text-decoration: underline;
  text-decoration-style: dotted;

  &:hover {
    color: ${theme.colors.primaryHover};
  }
`
