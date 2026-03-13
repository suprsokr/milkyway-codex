import { type ReactNode, useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { theme } from '../../theme/theme.ts'

interface TooltipProps {
  text: string
  children: ReactNode
  position?: 'top' | 'bottom'
}

export const Tooltip = ({ text, children, position = 'top' }: TooltipProps): ReactNode => {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({
        x: rect.left + rect.width / 2,
        y: position === 'top' ? rect.top : rect.bottom,
      })
      setVisible(true)
    }, 300)
  }, [position])

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVisible(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Trigger ref={triggerRef} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible &&
        createPortal(
          <Bubble $position={position} style={{ left: coords.x, top: coords.y }}>
            {text.includes('\n')
              ? text.split('\n').map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))
              : text}
          </Bubble>,
          document.body,
        )}
    </Trigger>
  )
}

const Trigger = styled.span`
  display: inline-flex;
`

const Bubble = styled.div<{ $position: 'top' | 'bottom' }>`
  position: fixed;
  z-index: 9999;
  transform: ${({ $position }) =>
    $position === 'top' ? 'translate(-50%, calc(-100% - 8px))' : 'translate(-50%, 8px)'};
  max-width: 280px;
  padding: 6px 12px;
  font-family: ${theme.fonts.body};
  font-size: 12px;
  line-height: 1.5;
  color: ${theme.colors.textBright};
  background: ${theme.colors.bgElevated};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  pointer-events: none;
  white-space: normal;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  animation: tooltip-in 0.15s ease;

  @keyframes tooltip-in {
    from {
      opacity: 0;
      transform: ${({ $position }) =>
        $position === 'top'
          ? 'translate(-50%, calc(-100% - 4px))'
          : 'translate(-50%, 4px)'};
    }
    to {
      opacity: 1;
      transform: ${({ $position }) =>
        $position === 'top'
          ? 'translate(-50%, calc(-100% - 8px))'
          : 'translate(-50%, 8px)'};
    }
  }
`
