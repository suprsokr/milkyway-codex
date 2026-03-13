import { type ReactNode, useState, useMemo } from 'react'
import { ExternalLink } from 'lucide-react'
import styled from 'styled-components'
import { theme } from '../../../theme/theme.ts'
import { SearchBar } from '../../../components/shared/SearchBar.tsx'
import { ListHeader, ListTitle, ListCount } from '../../../components/shared/ListPage.tsx'
import { ExternalRef } from '../../../components/shared/DetailPage.tsx'
import { DataTable } from '../../../components/shared/DataTable.tsx'
import { CodeBlock } from '../../../components/shared/CodeBlock.tsx'
import { SECURE_TEMPLATES } from '../../../data/secure-templates.ts'

const SecureTemplatesPage = (): ReactNode => {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (query.length === 0) return SECURE_TEMPLATES
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    return SECURE_TEMPLATES.filter((t) => {
      const text = `${t.name} ${t.description} ${t.attributes.map((a) => a.name).join(' ')}`.toLowerCase()
      return terms.every((term) => text.includes(term))
    })
  }, [query])

  return (
    <Container>
      <ListHeader>
        <ListTitle>Secure Templates</ListTitle>
        <ListCount>{filtered.length} templates</ListCount>
      </ListHeader>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search secure templates..."
        resultCount={query.length > 0 ? filtered.length : undefined}
      />

      <TemplatesList>
        {filtered.map((t) => (
          <TemplateCard key={t.name} id={t.name}>
            <TemplateName>{t.name}</TemplateName>
            {t.description && <TemplateDesc>{t.description}</TemplateDesc>}

            {t.attributes.length > 0 && (
              <DataTable>
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Values</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {t.attributes.map((a) => (
                    <tr key={a.name}>
                      <AttrName>{a.name}</AttrName>
                      <AttrValues>{a.values.join(', ') || '—'}</AttrValues>
                      <td>{a.description}</td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            )}

            {t.examples.length > 0 &&
              t.examples.map((ex, i) => (
                <CodeBlock key={i} code={ex.code} language={ex.language} title={ex.title} />
              ))}
          </TemplateCard>
        ))}
      </TemplatesList>

      <SourceLink>
        <ExternalRef
          href="https://web.archive.org/web/20100701213739/http://wowprogramming.com/docs/secure_template"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={14} />
          Source: WoWProgramming.com Secure Templates (archived)
        </ExternalRef>
      </SourceLink>
    </Container>
  )
}

export default SecureTemplatesPage

const Container = styled.div`
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const TemplatesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const TemplateCard = styled.div`
  background: ${theme.colors.bgCard};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.lg};
  padding: 20px;
  overflow: hidden;
`

const TemplateName = styled.h2`
  font-family: ${theme.fonts.code};
  font-size: 18px;
  color: ${theme.colors.primary};
  margin-bottom: 8px;
`

const TemplateDesc = styled.p`
  font-size: 14px;
  color: ${theme.colors.text};
  line-height: 1.6;
  margin-bottom: 12px;
  overflow-wrap: break-word;
  word-break: break-word;

  &:last-child {
    margin-bottom: 0;
  }
`

const SourceLink = styled.div`
  padding-top: 4px;
`

const AttrName = styled.td`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  color: ${theme.colors.textBright} !important;
  white-space: pre-line;
`

const AttrValues = styled.td`
  font-family: ${theme.fonts.code};
  font-size: 12px;
  color: ${theme.colors.paramType} !important;
`
