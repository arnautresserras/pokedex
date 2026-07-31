/**
 * A choice, as a picture. The child taps these and cannot read the label under them, so this
 * is the whole interface of Story mode as far as they're concerned.
 *
 * Two rules, both different from `TypeGlyph`'s:
 *
 *   1. **These are little windows, not marks.** A type glyph is a symbol in the room's own
 *      colour; a choice is a picture of somewhere you could go, so it's full-bleed and carries
 *      its own literal palette — the sunny path has to be sunny. The tile crops it, which is
 *      why nothing here has rounded corners.
 *   2. **Show the place, not the verb.** "Left" and "right" are arrows a 4-year-old has to be
 *      taught; sun-versus-shade and up-versus-down are things they can see. Every choice in a
 *      story should be expressible as two of these, which is a constraint on the authoring as
 *      much as on the drawing.
 *
 * It ships no CSS of its own, unlike `TypeGlyph`: the tile's `.picture` class is the single
 * owner of its size, which is the same contract read from the other end — one rule setting a
 * glyph's dimensions, never two in different files racing over it.
 *
 * An unknown id renders **loudly** rather than nothing. A blank tile is indistinguishable from
 * a working one to a child who then taps it and gets a scene they didn't choose, and this is
 * the one story failure `verify` can't catch: it can assert a choice *has* an icon, but the
 * icons live in JSX and the check runs under plain Node. So the fallback is the check.
 */
export default function ChoiceGlyph({ icon, className = '' }) {
  const Shape = ICONS[icon]

  if (!Shape) {
    return (
      <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
        <rect width="100" height="100" fill="#FF00A6" />
        <text
          x="50"
          y="72"
          textAnchor="middle"
          fontSize="64"
          fontWeight="900"
          fill="#fff"
          fontFamily="sans-serif"
        >
          ?
        </text>
      </svg>
    )
  }

  return <Shape className={className} />
}

/** A sunlit path opening between two trees, heading towards the light. */
function SunnyPath({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" fill="#CFE7B0" />
      <rect y="0" width="100" height="52" fill="#BFE4F2" />
      <circle cx="50" cy="18" r="22" fill="#FFF3B8" opacity="0.55" />
      <circle cx="50" cy="18" r="11" fill="#FFD84E" />
      <rect y="52" width="100" height="48" fill="#6FA84F" />
      {/* The path: wide at the child's feet, narrowing into the sun. */}
      <polygon points="42,52 58,52 84,100 16,100" fill="#E7C98C" />
      <g fill="#3F7A3E">
        <circle cx="8" cy="40" r="20" />
        <circle cx="92" cy="36" r="22" />
        <circle cx="24" cy="46" r="13" />
        <circle cx="77" cy="44" r="14" />
      </g>
      <g fill="#5B4327">
        <rect x="4" y="52" width="9" height="22" rx="3" />
        <rect x="88" y="50" width="10" height="24" rx="3" />
      </g>
    </svg>
  )
}

/** The same path, but the trees close over it and the light stays up top. */
function DarkPath({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" fill="#1C3527" />
      <rect y="0" width="100" height="54" fill="#254535" />
      {/* A gap of light at the far end, so the path reads as going somewhere. */}
      <ellipse cx="50" cy="53" rx="13" ry="7" fill="#8FBF7A" opacity="0.6" />
      <rect y="54" width="100" height="46" fill="#1B3126" />
      <polygon points="42,54 58,54 84,100 16,100" fill="#2C4634" />
      {/* Canopy arching across the top — the choice is "into the dark", and the dark has to
          be on top of you, not just behind you. */}
      <path d="M0 0h100v22C74 44 26 44 0 22Z" fill="#122318" />
      <g fill="#16291C">
        <circle cx="4" cy="30" r="24" />
        <circle cx="96" cy="26" r="26" />
        <circle cx="22" cy="40" r="15" />
        <circle cx="78" cy="38" r="16" />
      </g>
      <g fill="#20140C">
        <rect x="2" y="46" width="10" height="30" rx="3" />
        <rect x="88" y="44" width="11" height="32" rx="3" />
      </g>
    </svg>
  )
}

/** A branch within reach, with two leaves already on their way down. */
function Branch({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" fill="#CBE5AC" />
      <path
        d="M0 22C26 28 54 34 100 26"
        stroke="#7A5230"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M46 30C52 44 62 50 70 52" stroke="#7A5230" strokeWidth="6" fill="none" />
      <g fill="#4E8C3C">
        <ellipse cx="18" cy="16" rx="13" ry="6.5" transform="rotate(-22 18 16)" />
        <ellipse cx="44" cy="20" rx="12" ry="6" transform="rotate(12 44 20)" />
        <ellipse cx="74" cy="18" rx="13" ry="6.5" transform="rotate(-14 74 18)" />
        <ellipse cx="72" cy="56" rx="11" ry="5.5" transform="rotate(24 72 56)" />
      </g>
      {/* Falling: two leaves lower down, tilted the other way, plus the wobble the branch is
          making. The leaves carry it on their own if the arcs read as decoration. */}
      <g fill="#6FA845">
        <ellipse cx="34" cy="62" rx="10" ry="5" transform="rotate(34 34 62)" />
        <ellipse cx="56" cy="84" rx="9" ry="4.5" transform="rotate(-28 56 84)" />
      </g>
      <g stroke="#8FBF6A" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M88 40C93 44 95 50 94 56" />
        <path d="M14 38C9 42 7 48 8 54" />
      </g>
    </svg>
  )
}

/** A pile of leaves with somebody underneath it, not quite hidden. */
function Leaves({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" fill="#E3D2AC" />
      {/* Under-layer first. */}
      <g fill="#A2611F">
        <ellipse cx="20" cy="44" rx="18" ry="9" transform="rotate(-18 20 44)" />
        <ellipse cx="80" cy="42" rx="18" ry="9" transform="rotate(22 80 42)" />
        <ellipse cx="50" cy="34" rx="17" ry="8.5" transform="rotate(-6 50 34)" />
      </g>
      {/* Two eyes, between the layers: peeking is the whole idea, so they're drawn under the
          top leaves and over the bottom ones. */}
      <g>
        <circle cx="42" cy="54" r="7" fill="#fff" />
        <circle cx="60" cy="54" r="7" fill="#fff" />
        <circle cx="43" cy="55" r="3.4" fill="#22180C" />
        <circle cx="59" cy="55" r="3.4" fill="#22180C" />
      </g>
      <g fill="#C9822F">
        <ellipse cx="14" cy="66" rx="19" ry="9.5" transform="rotate(12 14 66)" />
        <ellipse cx="50" cy="74" rx="21" ry="10.5" transform="rotate(-8 50 74)" />
        <ellipse cx="86" cy="66" rx="19" ry="9.5" transform="rotate(-16 86 66)" />
        <ellipse cx="30" cy="88" rx="18" ry="9" transform="rotate(-6 30 88)" />
        <ellipse cx="70" cy="90" rx="18" ry="9" transform="rotate(10 70 90)" />
      </g>
      <g fill="#D9A34A">
        <ellipse cx="34" cy="62" rx="14" ry="7" transform="rotate(-24 34 62)" />
        <ellipse cx="68" cy="60" rx="14" ry="7" transform="rotate(20 68 60)" />
      </g>
    </svg>
  )
}

/** A break in low storm clouds, a spark of lightning dropping out of it. */
function CloudGap({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" fill="#2E3B52" />
      <rect y="0" width="100" height="58" fill="#3B4C6B" />
      {/* The gap: a pale break in the clouds, where the light gets through. */}
      <ellipse cx="50" cy="30" rx="26" ry="16" fill="#DCE8F7" opacity="0.9" />
      <ellipse cx="50" cy="30" rx="15" ry="9" fill="#F3F8FF" />
      <g fill="#232E42">
        <ellipse cx="8" cy="18" rx="20" ry="12" />
        <ellipse cx="92" cy="14" rx="22" ry="13" />
        <ellipse cx="20" cy="44" rx="16" ry="10" />
        <ellipse cx="80" cy="42" rx="17" ry="10" />
      </g>
      <rect y="58" width="100" height="42" fill="#1C2333" />
      {/* The spark, dropping out of the gap towards the ground. */}
      <polygon points="52,40 44,60 51,60 45,86 63,54 54,54 59,40" fill="#FFD94E" />
    </svg>
  )
}

/** Dry grass with a current running along the ground beneath it. */
function GrassRipple({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" fill="#DCC77E" />
      <rect y="46" width="100" height="54" fill="#C7A94E" />
      <g fill="#8C9A3E">
        <path d="M10 100 L14 58 L18 100 Z" />
        <path d="M26 100 L31 50 L36 100 Z" />
        <path d="M46 100 L50 46 L55 100 Z" />
        <path d="M66 100 L70 52 L76 100 Z" />
        <path d="M84 100 L89 58 L94 100 Z" />
      </g>
      {/* The current, running along the ground under the blades. */}
      <polyline
        points="4,74 24,66 40,78 58,64 76,76 96,68"
        fill="none"
        stroke="#FFE35A"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

const ICONS = {
  'sunny-path': SunnyPath,
  'dark-path': DarkPath,
  branch: Branch,
  leaves: Leaves,
  'cloud-gap': CloudGap,
  'grass-ripple': GrassRipple,
}
