import { useState } from 'react'
import { Tappable } from '../../motion'
import { ACTIVITIES, ACTIVITY_KEYS } from './activities'
import styles from './ActivityPicker.module.css'

/**
 * The one control Game adds to `ModeScreen`'s free corner — a parent choosing which activity is
 * on, without a second home tile or a menu screen. Same "roughly a third the area of a child
 * target" size as Story's `ParentControls`: this is a setting, not something a round hands the
 * child a reason to explore.
 *
 * **A button that opens a small tray, not a cycle.** `ActivityToggle` (this replaces it) cycled
 * one tap at a time through three states; five activities plus "mix" made a cycle six taps long
 * in the worst case, which stops being "graceful" once there's more than a couple of stops. A
 * tray shows every option at once and picks in one tap, at the cost of a second tap to open it —
 * the right trade once the list is more than two or three long.
 *
 * The tray closes itself on a pick. It doesn't close on an outside tap: it's small, anchored to
 * the corner it opened from, and covers nothing a round needs — leaving it open costs nothing a
 * parent would notice, and closing on a stray tap would cost a re-open for no benefit.
 */
export default function ActivityPicker({ activity, onChange }) {
  const [open, setOpen] = useState(false)

  const pick = key => {
    onChange(key)
    setOpen(false)
  }

  return (
    <div className={styles.picker}>
      {open && (
        <div className={styles.tray}>
          <TrayButton current={activity === 'mix'} label="Barrejat" onTap={() => pick('mix')}>
            <MixIcon />
          </TrayButton>

          {ACTIVITY_KEYS.map(key => (
            <TrayButton
              key={key}
              current={activity === key}
              label={ACTIVITIES[key].label}
              onTap={() => pick(key)}
            >
              <ActivityIcon activityKey={key} />
            </TrayButton>
          ))}
        </div>
      )}

      <Tappable
        className={styles.toggle}
        onTap={() => setOpen(o => !o)}
        pressScale={0.88}
        aria-label="Tria l'activitat"
      >
        {activity === 'mix' ? <MixIcon /> : <ActivityIcon activityKey={activity} />}
      </Tappable>
    </div>
  )
}

function TrayButton({ current, label, onTap, children }) {
  return (
    <Tappable
      className={[styles.trayButton, current ? styles.current : ''].filter(Boolean).join(' ')}
      onTap={onTap}
      pressScale={0.88}
      aria-label={label}
    >
      {children}
    </Tappable>
  )
}

/** "Any of them, at random" — the state a locked pick always returns to when re-cycled. */
function MixIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M5 9h5l13 14h4M22 9h5v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 23h5l3.5-3.8M22 23h5v-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ActivityIcon({ activityKey }) {
  switch (activityKey) {
    case 'silhouette':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* A pokéball — "guess the Pokémon". */}
          <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M5 16h8M19 16h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="16" cy="16" r="3.4" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    case 'type':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* Three overlapping dots — "guess the colour", the same currency Explore's rooms use. */}
          <circle cx="12" cy="13" r="7" fill="currentColor" opacity="0.85" />
          <circle cx="21" cy="13" r="7" fill="currentColor" opacity="0.55" />
          <circle cx="16.5" cy="21" r="7" fill="currentColor" opacity="0.7" />
        </svg>
      )
    case 'family':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* Two linked circles — "these two belong together". */}
          <circle cx="10" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="22" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M15 16h2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    case 'evolution':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* Three growing dots, chained — "this becomes that becomes that". */}
          <circle cx="5" cy="22" r="3" fill="currentColor" />
          <path d="M9.5 22h2.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="16" cy="18" r="4.2" fill="currentColor" />
          <path d="M21.5 17h2.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="27" cy="12" r="5.4" fill="currentColor" />
        </svg>
      )
    case 'memory':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* Two cards — "find the matching one". */}
          <rect x="5" y="8" width="9" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
          <rect x="18" y="8" width="9" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    default:
      return null
  }
}
