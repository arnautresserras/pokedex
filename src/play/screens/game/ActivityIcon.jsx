/**
 * The pictograms for each Game activity, plus "any of them" (`MixIcon`) — `GameIndex`'s tiles are
 * the only consumer now that switching activity mid-round is gone along with `ActivityPicker`.
 * Split out into their own file rather than folded into `GameIndex` because a corner shortcut
 * that reused them might come back; the icons themselves don't care where they're drawn at.
 *
 * **Solid shapes, not thin outlines.** `ModeGlyph`'s own note is the model to hold these to: a
 * glyph should read as a small preview of the thing it stands for, confidently drawn, rather than
 * a generic pictogram decoded from a symbol library. Several icons here borrow a motif Game
 * already draws elsewhere at full size — the pokéball's accent-coloured button matches every
 * "next" arrow's own `var(--color-accent)` fill, the evolution chevron is the same shape
 * `EvolutionOrderGame`'s arrows use between slots, the memory card echoes its own card-back ring
 * — so a tile is a preview of its round, not a symbol standing in for it.
 */

/** "Any of them, at random" — the state a locked pick always returns to when re-cycled. */
export function MixIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M5 9h5l13 14h4M22 9h5v5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 23h5l3.5-3.8M22 23h5v-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ActivityIcon({ activityKey }) {
  switch (activityKey) {
    case 'silhouette':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* A pokéball, solid top half — "guess the Pokémon". */}
          <path d="M5 16a11 11 0 0 1 22 0z" fill="currentColor" />
          <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="2.6" />
          <path
            d="M4.3 16h7.3M20.4 16h7.3"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle
            cx="16" cy="16" r="4.4"
            fill="var(--color-accent)"
            stroke="currentColor"
            strokeWidth="2.6"
          />
        </svg>
      )
    case 'type':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* A paint drop — "guess the colour". */}
          <path
            d="M16 5c5 6 9 10.4 9 15a9 9 0 1 1-18 0c0-4.6 4-9 9-15z"
            fill="currentColor"
          />
          <ellipse cx="12.6" cy="20.4" rx="2.4" ry="3.2" fill="#fff" opacity="0.3" />
        </svg>
      )
    case 'family':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* Two different-sized circles, overlapping — parent and child, "belonging together". */}
          <circle cx="12" cy="18" r="8" fill="currentColor" opacity="0.55" />
          <circle cx="21.5" cy="12.5" r="5.5" fill="currentColor" />
        </svg>
      )
    case 'evolution':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* Three growing circles, joined by the same chevron the round uses between its
              slots — "this becomes that becomes that". */}
          <circle cx="5" cy="23" r="3" fill="currentColor" />
          <path
            d="M10 25l3-2-3-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="17" cy="18" r="4.2" fill="currentColor" />
          <path
            d="M24 20l3-2-3-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="26.5" cy="10" r="5" fill="currentColor" />
        </svg>
      )
    case 'memory':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* Two cards, one still face-down with its own card-back ring — "find the matching
              one". */}
          <rect x="5" y="7" width="9" height="16" rx="2.4" fill="currentColor" />
          <rect x="18" y="7" width="9" height="16" rx="2.4" fill="currentColor" opacity="0.55" />
          <circle cx="22.5" cy="15" r="2.6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'sprite':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* A blocky, stair-stepped heart — pixel art, deliberately unlike the smooth vector
              shapes everywhere else in this list, since that jaggedness is the whole point of
              "match the sprite". */}
          <g fill="currentColor">
            <rect x="8" y="6" width="5" height="5" />
            <rect x="18" y="6" width="5" height="5" />
            <rect x="3" y="11" width="5" height="5" />
            <rect x="8" y="11" width="5" height="5" />
            <rect x="13" y="11" width="5" height="5" />
            <rect x="18" y="11" width="5" height="5" />
            <rect x="23" y="11" width="5" height="5" />
            <rect x="3" y="16" width="5" height="5" />
            <rect x="8" y="16" width="5" height="5" />
            <rect x="13" y="16" width="5" height="5" />
            <rect x="18" y="16" width="5" height="5" />
            <rect x="23" y="16" width="5" height="5" />
            <rect x="8" y="21" width="5" height="5" />
            <rect x="13" y="21" width="5" height="5" />
            <rect x="18" y="21" width="5" height="5" />
          </g>
        </svg>
      )
    case 'jigsaw':
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          {/* A picture cut into quarters, one piece still out of place — "put it back
              together", rather than four pieces scattered with nothing to reassemble. */}
          <rect x="4" y="4" width="11" height="11" rx="2" fill="currentColor" />
          <rect x="17" y="4" width="11" height="11" rx="2" fill="currentColor" opacity="0.55" />
          <rect x="4" y="17" width="11" height="11" rx="2" fill="currentColor" opacity="0.55" />
          <rect
            x="18.5" y="18.5" width="11" height="11" rx="2"
            fill="currentColor"
            transform="rotate(10 24 24)"
          />
        </svg>
      )
    default:
      return null
  }
}
