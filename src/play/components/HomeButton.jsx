import { useNavigate } from 'react-router-dom'
import { Tappable } from '../motion'
import styles from './HomeButton.module.css'

/**
 * "Take me back" — the one control that exists in every mode, always the same mark in the
 * same corner. A child who can't read has to learn exactly one escape hatch, so it must never
 * move, recolour, or restyle itself per mode: it's the fixed point the modes hang off.
 *
 * The mark is the pokéball from `public/pokeball.svg`, inlined rather than loaded — same
 * drawing as the favicon and (in slice 6) the home-screen icon, so the thing they tap to
 * launch the app is the thing they tap to get back to its front page.
 *
 * Rendered by `ModeScreen`, which owns the corner. Don't place it by hand in a mode.
 */
export default function HomeButton({ className = '' }) {
  const navigate = useNavigate()

  return (
    <Tappable
      className={[styles.home, className].filter(Boolean).join(' ')}
      onTap={() => navigate('/play')}
      aria-label="Inici"
    >
      <svg className={styles.ball} viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="30" fill="#f6f6f8" stroke="#16161a" strokeWidth="4" />
        <path d="M2 32a30 30 0 0 1 60 0Z" fill="#e3350d" stroke="#16161a" strokeWidth="4" />
        <path d="M2 32h60" stroke="#16161a" strokeWidth="6" />
        <circle cx="32" cy="32" r="10" fill="#f6f6f8" stroke="#16161a" strokeWidth="5" />
        <circle cx="32" cy="32" r="4" fill="#16161a" />
      </svg>
    </Tappable>
  )
}
