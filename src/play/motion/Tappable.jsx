import { useCallback, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'
import styles from './Tappable.module.css'

/**
 * The tap-acknowledgement primitive. Everything tappable in the play app goes through it.
 *
 * With no sound and no haptics, a tap that produces no visible change reads as a broken
 * screen to a 4-year-old, who then taps harder and elsewhere. So the press state is driven
 * from `pointerdown` (immediate, ~0ms) rather than waiting for a click, and the release
 * overshoots slightly on the way back for a "pop".
 *
 * Reduced motion substitutes an instant brightness + ring change — still unmistakable
 * feedback, just not animated.
 */
export default function Tappable({
  children,
  onTap,
  as: Tag = 'button',
  className = '',
  style,
  pressScale = 0.94,
  disabled = false,
  ...rest
}) {
  const reduced = useReducedMotion()
  const [pressed, setPressed] = useState(false)

  const release = useCallback(() => setPressed(false), [])

  const handleClick = e => {
    if (disabled) return
    onTap?.(e)
  }

  const classes = [
    styles.tappable,
    pressed ? styles.pressed : '',
    reduced ? styles.reduced : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      {...(Tag === 'button' ? { type: 'button', disabled } : { role: 'button', tabIndex: 0 })}
      className={classes}
      style={{ '--press-scale': pressScale, ...style }}
      onPointerDown={() => !disabled && setPressed(true)}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Tag>
  )
}
