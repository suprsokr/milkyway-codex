import { type ReactNode, useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FixedSizeList } from 'react-window'
import { AlertTriangle, HelpCircle, ExternalLink } from 'lucide-react'
import { getStatus } from '../../../components/shared/FreshnessBadge.tsx'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { ListHeader, ListTitle, ListCount, FilterGroup, FilterButton } from '../../../components/shared/ListPage.tsx'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
import { API_FUNCTIONS } from '../../../data/api-functions.ts'
import { EVENTS } from '../../../data/events.ts'
import { WIDGETS } from '../../../data/widgets.ts'
import { DATA_TYPES } from '../../../data/data-types.ts'
import { CVARS } from '../../../data/cvars.ts'

interface UnverifiedEntry {
  name: string
  type: 'function' | 'event' | 'widget' | 'datatype' | 'cvar'
  status: 'unverified' | 'review'
  description: string
  path: string
}

type FilterType = 'all' | 'function' | 'event' | 'widget' | 'datatype' | 'cvar'
type StatusFilter = 'all' | 'unverified' | 'review'

const mapStatus = (s: 'confirmed' | 'review' | 'unverified'): 'unverified' | 'review' => {
  return s === 'unverified' ? 'unverified' : 'review'
}

const buildEntries = (): UnverifiedEntry[] => {
  const entries: UnverifiedEntry[] = []

  for (const fn of API_FUNCTIONS) {
    const status = getStatus({ description: fn.description, memoryAddress: fn.memoryAddress, documentationUrl: fn.documentationUrl, bookPage: fn.bookPage })
    if (status !== 'confirmed') {
      entries.push({ name: fn.name, type: 'function', status: mapStatus(status), description: fn.description, path: `/api/${fn.name}` })
    }
  }

  for (const evt of EVENTS) {
    const status = getStatus({ description: evt.description, documentationUrl: evt.documentationUrl, bookPage: evt.bookPage })
    if (status !== 'confirmed') {
      entries.push({ name: evt.name, type: 'event', status: mapStatus(status), description: evt.description, path: `/events/${evt.name}` })
    }
  }

  for (const w of WIDGETS) {
    const status = getStatus({ description: w.description, bookPage: w.bookPage })
    if (status !== 'confirmed') {
      entries.push({ name: w.name, type: 'widget', status: mapStatus(status), description: w.description, path: `/widgets/${w.name}` })
    }
  }

  for (const dt of DATA_TYPES) {
    const status = getStatus({ description: dt.description, bookPage: dt.bookPage })
    if (status !== 'confirmed') {
      entries.push({ name: dt.name, type: 'datatype', status: mapStatus(status), description: dt.description, path: `/data-types#${dt.name}` })
    }
  }

  for (const cv of CVARS) {
    if (cv.description.length === 0) {
      entries.push({ name: cv.name, type: 'cvar', status: 'unverified', description: '', path: '/cvars' })
    }
  }

  return entries
}

const TYPE_LABELS: Record<string, string> = {
  function: 'Function',
  event: 'Event',
  widget: 'Widget',
  datatype: 'Data Type',
  cvar: 'CVar',
}

const ContributePage = (): ReactNode => {
  const [filter, setFilter] = useState<FilterType>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')

  const allEntries = useMemo(() => buildEntries(), [])

  const filtered = useMemo(() => {
    let result = filter === 'all' ? allEntries : allEntries.filter((e) => e.type === filter)
    if (statusFilter !== 'all') {
      result = result.filter((e) => e.status === statusFilter)
    }
    if (query.length > 0) {
      const q = query.toLowerCase()
      result = result.filter((e) => e.name.toLowerCase().includes(q))
    }
    return result
  }, [allEntries, filter, statusFilter, query])

  const counts = useMemo(() => {
    const c = { all: allEntries.length, function: 0, event: 0, widget: 0, datatype: 0, cvar: 0 }
    for (const e of allEntries) c[e.type]++
    return c
  }, [allEntries])

  const unverifiedCount = allEntries.filter((e) => e.status === 'unverified').length
  const reviewCount = allEntries.filter((e) => e.status === 'review').length

  const listContainerRef = useRef<HTMLDivElement>(null)
  const [listHeight, setListHeight] = useState(400)

  useEffect(() => {
    const el = listContainerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setListHeight(entry.contentRect.height)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Container>
      <ListHeader>
        <ListTitle>Contribute</ListTitle>
        <ListCount>{allEntries.length} entries need help</ListCount>
      </ListHeader>

      <Intro>
        MilkyWay Codex aims to be the most complete WoW 3.3.5a reference. The entries below
        are missing documentation or need verification. Help us improve them by submitting
        a merge request on the{' '}
        <RepoLink href="https://github.com/Shard-MW/milkyway-codex" target="_blank" rel="noopener noreferrer">
          repository <ExternalLink size={12} />
        </RepoLink>.
      </Intro>

      <StatsRow>
        <StatCard $color="rgba(239, 68, 68, 0.1)" $border="rgba(239, 68, 68, 0.2)">
          <AlertTriangle size={16} color="#ef4444" />
          <StatNumber>{unverifiedCount}</StatNumber>
          <StatLabel>Unverified</StatLabel>
        </StatCard>
        <StatCard $color="rgba(245, 158, 11, 0.1)" $border="rgba(245, 158, 11, 0.2)">
          <HelpCircle size={16} color="#f59e0b" />
          <StatNumber>{reviewCount}</StatNumber>
          <StatLabel>To Review</StatLabel>
        </StatCard>
      </StatsRow>

      <FilterSection>
        <FilterRow>
          <FilterLabel>Type</FilterLabel>
          <FilterGroup>
            <FilterButton $active={filter === 'all'} onClick={() => setFilter('all')}>
              All ({counts.all})
            </FilterButton>
            <FilterButton $active={filter === 'function'} onClick={() => setFilter('function')}>
              Functions ({counts.function})
            </FilterButton>
            <FilterButton $active={filter === 'event'} onClick={() => setFilter('event')}>
              Events ({counts.event})
            </FilterButton>
            <FilterButton $active={filter === 'widget'} onClick={() => setFilter('widget')}>
              Widgets ({counts.widget})
            </FilterButton>
            <FilterButton $active={filter === 'cvar'} onClick={() => setFilter('cvar')}>
              CVars ({counts.cvar})
            </FilterButton>
          </FilterGroup>
        </FilterRow>
        <FilterRow>
          <FilterLabel>Status</FilterLabel>
          <FilterGroup>
            <FilterButton $active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
              All
            </FilterButton>
            <FilterButton $active={statusFilter === 'unverified'} onClick={() => setStatusFilter('unverified')}>
              Unverified ({unverifiedCount})
            </FilterButton>
            <FilterButton $active={statusFilter === 'review'} onClick={() => setStatusFilter('review')}>
              To Review ({reviewCount})
            </FilterButton>
          </FilterGroup>
        </FilterRow>
      </FilterSection>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search entries..."
        resultCount={query.length > 0 ? filtered.length : undefined}
      />

      <VirtualListContainer ref={listContainerRef}>
        <FixedSizeList
          height={listHeight}
          width="100%"
          itemCount={filtered.length}
          itemSize={42}
          itemData={filtered}
        >
          {EntryRowRenderer}
        </FixedSizeList>
      </VirtualListContainer>
    </Container>
  )
}

const EntryRowRenderer = ({ index, style, data }: { index: number; style: React.CSSProperties; data: UnverifiedEntry[] }): ReactNode => {
  const e = data[index]
  return (
    <div style={style}>
      <EntryRow>
        <EntryLink to={e.path}>
          <EntryName>{e.name}</EntryName>
        </EntryLink>
        <EntryMeta>
          <TypeBadge $type={e.type}>{TYPE_LABELS[e.type]}</TypeBadge>
          <StatusBadge $status={e.status}>
            {e.status === 'unverified' ? 'Unverified' : 'To Review'}
          </StatusBadge>
        </EntryMeta>
      </EntryRow>
    </div>
  )
}

export default ContributePage

const Container = styled.div`
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(100vh - 48px);

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: calc(100dvh - 48px - 48px);
  }
`

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const FilterLabel = styled.span`
  font-size: 11px;
  font-family: ${theme.fonts.code};
  color: ${theme.colors.textMuted};
  min-width: 48px;
`

const Intro = styled.p`
  font-size: 14px;
  color: ${theme.colors.text};
  line-height: 1.6;
`

const RepoLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${theme.colors.primary};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`

const StatsRow = styled.div`
  display: flex;
  gap: 12px;
`

const StatCard = styled.div<{ $color: string; $border: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${(p) => p.$color};
  border: 1px solid ${(p) => p.$border};
  border-radius: ${theme.radius.md};
`

const StatNumber = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.textBright};
`

const StatLabel = styled.span`
  font-size: 13px;
  color: ${theme.colors.textMuted};
`

const VirtualListContainer = styled.div`
  flex: 1;
  min-height: 0;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  overflow: hidden;
`

const EntryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  height: 42px;
  border-bottom: 1px solid ${theme.colors.border};

  &:hover {
    background: ${theme.colors.bgElevated};
  }
`

const EntryLink = styled(Link)`
  flex: 1;
  min-width: 0;
`

const EntryName = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.primary};

  &:hover {
    text-decoration: underline;
  }
`

const EntryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const TypeBadge = styled.span<{ $type: string }>`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: ${theme.radius.sm};
  background: ${(p) => {
    switch (p.$type) {
      case 'function': return 'rgba(56, 189, 248, 0.1)'
      case 'event': return 'rgba(245, 158, 11, 0.1)'
      case 'widget': return 'rgba(192, 132, 252, 0.1)'
      case 'cvar': return 'rgba(148, 163, 184, 0.1)'
      default: return 'rgba(134, 239, 172, 0.1)'
    }
  }};
  color: ${(p) => {
    switch (p.$type) {
      case 'function': return theme.colors.primary
      case 'event': return theme.colors.accent
      case 'widget': return theme.colors.luaType
      case 'cvar': return theme.colors.textMuted
      default: return theme.colors.returnType
    }
  }};
`

const StatusBadge = styled.span<{ $status: string }>`
  font-size: 10px;
  padding: 2px 6px;
  border-radius: ${theme.radius.sm};
  background: ${(p) => p.$status === 'unverified' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)'};
  color: ${(p) => p.$status === 'unverified' ? theme.colors.error : theme.colors.warning};
  border: 1px solid ${(p) => p.$status === 'unverified' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'};
`

