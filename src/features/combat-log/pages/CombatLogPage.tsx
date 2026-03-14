import { type ReactNode, useState } from 'react'
import { BookOpen } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { ListHeader, ListTitle, ListCount, Filters, FilterGroup, FilterButton } from '../../../components/shared/ListPage.tsx'
import { BookRefLink } from '../../../components/shared/DetailPage.tsx'
import { DataTable, NameCell, TypeCell } from '../../../components/shared/DataTable.tsx'
import { TypeLink } from '../../../components/shared/TypeLink.tsx'
import {
  COMBAT_LOG_SUB_EVENTS,
  COMBAT_LOG_PREFIXES,
  STANDARD_COMBAT_LOG_ARGS,
  SPELL_SCHOOLS,
} from '../../../data/combat-log-events.ts'
import type { CombatLogArgument } from '../../../types/api.types.ts'

type FilterType = 'all' | 'prefix' | 'suffix' | 'special'

const CombatLogPage = (): ReactNode => {
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = filter === 'all'
    ? COMBAT_LOG_SUB_EVENTS
    : COMBAT_LOG_SUB_EVENTS.filter((e) => e.type === filter)

  return (
    <Container>
      <ListHeader>
        <ListTitle>Combat Log Sub-Events</ListTitle>
        <ListCount>
          {COMBAT_LOG_SUB_EVENTS.length} sub-events
        </ListCount>
      </ListHeader>

      <Intro>
        Combat log events are delivered via COMBAT_LOG_EVENT_UNFILTERED with 8 standard arguments
        followed by sub-event-specific arguments. Each sub-event name is formed by combining a
        prefix (SWING, RANGE, SPELL, ENVIRONMENTAL) with a suffix (_DAMAGE, _HEAL, _MISSED, etc.).
      </Intro>

      <Section>
        <SectionTitle>Standard Arguments (all sub-events)</SectionTitle>
        <ArgTable args={STANDARD_COMBAT_LOG_ARGS} />
      </Section>

      <Section>
        <SectionTitle>Prefixes</SectionTitle>
        <PrefixGrid>
          {COMBAT_LOG_PREFIXES.map((p) => (
            <PrefixCard key={p.name}>
              <PrefixName>{p.name}</PrefixName>
              <PrefixDesc>{p.description}</PrefixDesc>
              {p.arguments.length > 0 && (
                <PrefixArgs>
                  {p.arguments.map((a) => (
                    <ArgChip key={a.name}>
                      <span>{a.name}</span>
                      <ArgType>{a.type}</ArgType>
                    </ArgChip>
                  ))}
                </PrefixArgs>
              )}
            </PrefixCard>
          ))}
        </PrefixGrid>
      </Section>

      <Section>
        <SectionTitle>Spell Schools</SectionTitle>
        <SchoolGrid>
          {SPELL_SCHOOLS.map((s) => (
            <SchoolChip key={s.value}>
              <SchoolValue>{s.value}</SchoolValue>
              <span>{s.name}</span>
              <SchoolBinary>{s.binary}</SchoolBinary>
            </SchoolChip>
          ))}
        </SchoolGrid>
      </Section>

      <Section>
        <SectionTitle>Sub-Events</SectionTitle>
        <Filters>
          <FilterGroup>
            <FilterButton $active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterButton>
            <FilterButton $active={filter === 'suffix'} onClick={() => setFilter('suffix')}>Prefix+Suffix</FilterButton>
            <FilterButton $active={filter === 'special'} onClick={() => setFilter('special')}>Special</FilterButton>
          </FilterGroup>
        </Filters>
        <EventList>
          {filtered.map((evt) => (
            <EventCard key={evt.name}>
              <EventHeader>
                <EventName>{evt.name}</EventName>
                <EventType $type={evt.type}>{evt.type}</EventType>
              </EventHeader>
              <EventDesc>{evt.description}</EventDesc>
              {evt.arguments.length > 0 && (
                <ArgTable args={evt.arguments} />
              )}
            </EventCard>
          ))}
        </EventList>
      </Section>

      <BookRefLink href="/book?page=429">
        <BookOpen size={14} />
        View in Reference Book (Ch 21 — Combat Log & Threat)
      </BookRefLink>
    </Container>
  )
}

const ArgTable = ({ args }: { args: CombatLogArgument[] }): ReactNode => (
  <DataTable>
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      {args.map((a) => (
        <tr key={a.name}>
          <NameCell>{a.name}</NameCell>
          <TypeCell><TypeLink type={a.type} /></TypeCell>
          <td>
            {a.description}
            {a.values && (
              <ValuesList>
                {a.values.map((v) => (
                  <ValueItem key={v.value}>
                    <code>{v.value}</code> — {v.label}
                  </ValueItem>
                ))}
              </ValuesList>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </DataTable>
)

export default CombatLogPage

// Styled components at bottom
const Container = styled.div`
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Intro = styled.p`
  font-size: 14px;
  color: ${theme.colors.text};
  line-height: 1.6;
`

const Section = styled.div`
  margin-bottom: 16px;
`

const SectionTitle = styled.h2`
  font-size: 16px;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${theme.colors.border};
`

const PrefixGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
`

const PrefixCard = styled.div`
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  padding: 12px 14px;
`

const PrefixName = styled.div`
  font-family: ${theme.fonts.code};
  font-size: 14px;
  color: ${theme.colors.primary};
  font-weight: 600;
  margin-bottom: 4px;
`

const PrefixDesc = styled.div`
  font-size: 12px;
  color: ${theme.colors.text};
  line-height: 1.5;
`

const PrefixArgs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`

const ArgChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: ${theme.fonts.code};
  font-size: 11px;
  color: ${theme.colors.textBright};
  background: ${theme.colors.bgElevated};
  padding: 2px 8px;
  border-radius: ${theme.radius.sm};
`

const ArgType = styled.span`
  color: ${theme.colors.textMuted};
`

const SchoolGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

const SchoolChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${theme.colors.text};
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  padding: 4px 10px;
`

const SchoolValue = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 11px;
  color: ${theme.colors.primary};
  background: rgba(56, 189, 248, 0.1);
  padding: 1px 5px;
  border-radius: 3px;
  min-width: 20px;
  text-align: center;
`

const SchoolBinary = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 10px;
  color: ${theme.colors.textMuted};
`

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const EventCard = styled.div`
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  padding: 14px 16px;
`

const EventHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`

const EventName = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 14px;
  color: ${theme.colors.accent};
  font-weight: 600;
`

const EventType = styled.span<{ $type: string }>`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: ${theme.radius.sm};
  background: ${(p) => p.$type === 'special' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(56, 189, 248, 0.1)'};
  color: ${(p) => p.$type === 'special' ? theme.colors.accent : theme.colors.primary};
`

const EventDesc = styled.p`
  font-size: 13px;
  color: ${theme.colors.text};
  line-height: 1.5;
  margin-bottom: 8px;
`

const ValuesList = styled.ul`
  list-style: none;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const ValueItem = styled.li`
  font-size: 12px;
  color: ${theme.colors.text};

  code {
    font-family: ${theme.fonts.code};
    font-size: 11px;
    color: ${theme.colors.textBright};
    background: ${theme.colors.bgElevated};
    padding: 1px 4px;
    border-radius: 3px;
  }
`
