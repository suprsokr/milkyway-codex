import { type ReactNode, useState, useCallback, useMemo } from 'react'
import { Copy, Check } from 'lucide-react'
import styled from 'styled-components'
import { Highlight, Prism, themes } from 'prism-react-renderer'
import { theme } from '../../theme/theme.ts'
import { useThemeMode } from '../../hooks/use-theme-mode.hook.ts'

// Register Lua grammar for Prism
Prism.languages.lua = {
  comment: /^#!.*|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
  string: {
    pattern: /(["'])(?:(?!\1)[^\\\n]|\\[\s\S])*\1|\[(=*)\[[\s\S]*?\]\2\]/,
    greedy: true,
  },
  number: /\b0x[a-f\d]+(?:\.[a-f\d]*)?(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|(?:\.\d*)?(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
  keyword: /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
  'function': /(?!\d)\w+(?=\s*(?:[({]))/,
  operator: [
    /[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/,
    { pattern: /(^|[^.])\.\.(?!\.)/, lookbehind: true },
  ],
  punctuation: /[\[\](){},;]|\.+|:+/,
}

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
}

export const CodeBlock = ({ code, language = 'lua', title }: CodeBlockProps): ReactNode => {
  const { mode } = useThemeMode()
  const [copied, setCopied] = useState(false)

  const prismTheme = useMemo(() => mode === 'dark' ? themes.nightOwl : themes.github, [mode])

  const handleCopy = useCallback((): void => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const prismLang = useMemo(() => {
    const lang = language.toLowerCase()
    if (lang === 'lua' || lang === 'wow lua') return 'lua'
    if (lang === 'xml') return 'markup'
    return lang
  }, [language])

  return (
    <Container>
      <Header>
        {title && <Title>{title}</Title>}
        <Language>{language}</Language>
        <CopyButton onClick={handleCopy} aria-label="Copy code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </CopyButton>
      </Header>
      <Highlight theme={prismTheme} code={code.trim()} language={prismLang}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <Pre>
            <Code>
              {tokens.map((line, i) => (
                <Line key={i} {...getLineProps({ line })}>
                  <LineNo>{i + 1}</LineNo>
                  <LineContent>
                    {line.map((token, j) => (
                      <span key={j} {...getTokenProps({ token })} />
                    ))}
                  </LineContent>
                </Line>
              ))}
            </Code>
          </Pre>
        )}
      </Highlight>
    </Container>
  )
}

const Container = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${theme.colors.bgElevated};
  border-bottom: 1px solid ${theme.colors.border};
`

const Title = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 12px;
  color: ${theme.colors.textMuted};
  flex: 1;
`

const Language = styled.span`
  font-family: ${theme.fonts.code};
  font-size: 11px;
  color: ${theme.colors.textMuted};
  background: ${theme.colors.bgCard};
  padding: 2px 8px;
  border-radius: ${theme.radius.sm};
`

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: ${theme.fonts.code};
  font-size: 11px;
  color: ${theme.colors.textMuted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: ${theme.radius.sm};

  &:hover {
    color: ${theme.colors.textBright};
    background: ${theme.colors.bgCard};
  }
`

const Pre = styled.pre`
  padding: 12px 0;
  background: ${theme.colors.bgCode};
  overflow-x: auto;
  margin: 0;
`

const Code = styled.code`
  font-family: ${theme.fonts.code};
  font-size: 13px;
  line-height: 1.6;
`

const Line = styled.div`
  display: flex;
  min-height: 1.6em;
`

const LineNo = styled.span`
  display: inline-block;
  width: 40px;
  text-align: right;
  padding-right: 12px;
  color: ${theme.colors.textMuted};
  opacity: 0.4;
  user-select: none;
  flex-shrink: 0;
  font-size: 12px;
`

const LineContent = styled.span`
  flex: 1;
  padding-right: 16px;
  white-space: pre;
`
