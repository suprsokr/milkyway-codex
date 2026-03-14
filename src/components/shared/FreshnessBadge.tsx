import type { ReactNode } from 'react'
import { CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'
import { Tooltip } from './Tooltip.tsx'

export type FreshnessStatus = 'confirmed' | 'review' | 'unverified'

interface FreshnessBadgeProps {
  description: string
  memoryAddress?: string
  documentationUrl?: string
  bookPage?: number
}

// WotLK 3.3.5a era ends Oct 12 2010 — snapshots before this date are confirmed WotLK
const WOTLK_END = 20101012000000

const parseArchiveDate = (url: string): string | null => {
  const match = url.match(/web\/(\d{14})/)
  if (!match) return null
  const ts = match[1]
  return `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}`
}

const isWotlkEra = (url: string): boolean => {
  const match = url.match(/web\/(\d{14})/)
  if (!match) return false
  return Number(match[1]) < WOTLK_END
}

export const getStatus = (props: FreshnessBadgeProps): FreshnessStatus => {
  const hasRealDesc =
    props.description !== 'No documentation available.' && props.description.length > 0

  if (!hasRealDesc) return 'unverified'

  // Book reference = verified from the WotLK Programming book (golden source)
  if (props.bookPage) return 'confirmed'

  // Function confirmed in the 3.3.5a binary
  const hasAddr = Boolean(props.memoryAddress)
  const preCata = props.documentationUrl ? isWotlkEra(props.documentationUrl) : false

  // Confirmed: binary address + pre-Cata docs, OR binary address + no URL (binary is enough)
  if (hasAddr && (preCata || !props.documentationUrl)) return 'confirmed'

  // Pre-Cata docs without memory address (events) — still confirmed
  if (preCata) return 'confirmed'

  // Has real description but post-WotLK snapshot — info may have changed
  if (hasAddr) return 'review' // function exists in binary but docs are post-WotLK
  return 'review' // event with post-WotLK snapshot
}

const LABELS: Record<FreshnessStatus, string> = {
  confirmed: 'Verified',
  review: 'To review',
  unverified: 'Unverified',
}

const buildTooltip = (props: FreshnessBadgeProps, status: FreshnessStatus): string => {
  const parts: string[] = []

  if (status === 'confirmed') {
    parts.push('Verified WotLK 3.3.5a information')
    if (props.bookPage) {
      parts.push(`Source: WoW Programming book, 2nd Ed. (p.${props.bookPage})`)
    }
    if (props.memoryAddress) {
      parts.push('Function confirmed in client binary (build 12340)')
    }
  } else if (status === 'review') {
    parts.push('Documentation from a post-WotLK source')
    parts.push('Info may differ from the 3.3.5a version')
    if (props.memoryAddress) {
      parts.push('Function exists in client binary (build 12340)')
    }
  } else {
    parts.push('Documentation incomplete — needs community contribution')
  }

  if (props.documentationUrl) {
    const date = parseArchiveDate(props.documentationUrl)
    if (date) {
      const pre = isWotlkEra(props.documentationUrl)
      parts.push(`Source: Archive.org (${date})${pre ? '' : ' — post-WotLK snapshot'}`)
    }
  }

  return parts.join('\n')
}

export const FreshnessBadge = (props: FreshnessBadgeProps): ReactNode => {
  const status = getStatus(props)
  const tooltip = buildTooltip(props, status)
  const Icon = status === 'confirmed' ? CheckCircle : status === 'review' ? HelpCircle : AlertTriangle

  return (
    <Tooltip text={tooltip}>
      <Badge $status={status}>
        <Icon size={13} />
        <span>{LABELS[status]}</span>
      </Badge>
    </Tooltip>
  )
}

const statusColors: Record<FreshnessStatus, { fg: string; bg: string; border: string }> = {
  confirmed: {
    fg: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.2)',
  },
  review: {
    fg: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.2)',
  },
  unverified: {
    fg: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.2)',
  },
}

const Badge = styled.span<{ $status: FreshnessStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: ${theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 3px 10px;
  border-radius: ${theme.radius.sm};
  cursor: help;
  white-space: nowrap;

  color: ${({ $status }) => statusColors[$status].fg};
  background: ${({ $status }) => statusColors[$status].bg};
  border: 1px solid ${({ $status }) => statusColors[$status].border};
`
