import styles from './Backdrop.module.css'
import { sceneUrl } from '../../utils/playAssets.js'

/**
 * A scene's place, as a CSS gradient plus one inline SVG.
 *
 * No image pipeline and no licensing question — which is the practical argument — but the real
 * one is that a backdrop has to sit *behind* narration a parent reads at arm's length and
 * behind full-colour Pokémon art, and stay behind them. Painted illustrations fight both. Flat
 * layered silhouettes in a controlled palette can't: the values are chosen here, so the scrim
 * over them is legible by construction rather than by luck.
 *
 * Three shapes serve five backdrops. That's deliberate — the story's variety is in the prose
 * and the choices, and five bespoke drawings would be five chances for one to look unfinished:
 *
 *   forest → the treeline, seen from the path. Palette and sun make it dawn or dusk or gloom.
 *   canopy → looking *up* through the leaves at a gap of sky. The "shake the branch" ending.
 *   floor  → looking *down* at leaf litter. The "look underneath" ending.
 *
 * The two encounter shapes exist because the two endings differ by *where the child is
 * looking*, and a backdrop that ignored that would flatten the only real difference between
 * them.
 *
 * Nothing here is random: every position is a literal in a table. A backdrop that reshuffled
 * its trees on re-render would turn the parent's "back one scene" into a different forest.
 */

const BACKDROPS = {
  'forest-edge': {
    shape: 'forest',
    sky: ['#F7E0AC', '#C6DE9B'],
    trees: ['#6E9E52', '#4A7742', '#28502F'],
    floor: '#3D3324',
    trail: '#6B5637',
    sun: { cx: 50, cy: 13, r: 8 },
    motes: 5,
  },

  'sunlit-path': {
    shape: 'forest',
    sky: ['#FFF3C6', '#D8EBA6'],
    trees: ['#7DB159', '#55834A', '#2F5A36'],
    floor: '#463A26',
    trail: '#8A7047',
    sun: { cx: 62, cy: 10, r: 9 },
    shafts: true,
    motes: 8,
  },

  'dark-thicket': {
    shape: 'forest',
    sky: ['#2B4838', '#15271E'],
    trees: ['#2F5641', '#1E3E2E', '#11241B'],
    floor: '#151E19',
    trail: '#243027',
    // No sun: the thicket's whole point is that the light stayed up in the canopy.
    motes: 3,
  },

  canopy: {
    shape: 'canopy',
    sky: ['#FFF6CE', '#C3DE97'],
    trees: ['#4C7C48', '#2E5C34', '#1B3D25'],
    motes: 7,
  },

  'leaf-floor': {
    shape: 'floor',
    sky: ['#4C6B41', '#22331F'],
    floor: '#3A2E1C',
    leaves: ['#C9822F', '#A2611F', '#D9A34A', '#7C5320', '#B4702A'],
    motes: 4,
  },

  // "El camí de Pallet" (route1.js) — the same three shapes, a brighter and more open palette:
  // roadside hedges instead of deep forest, sun that actually reaches the ground.
  'pallet-road': {
    shape: 'forest',
    sky: ['#FFEFC2', '#CFEFAE'],
    trees: ['#8FC168', '#5FA24C', '#357238'],
    floor: '#5B4A2E',
    trail: '#C9A868',
    sun: { cx: 50, cy: 14, r: 9 },
    motes: 5,
  },

  'bright-meadow': {
    shape: 'forest',
    sky: ['#FFF6C9', '#DCEFAA'],
    trees: ['#9BCB6E', '#6FAE56', '#3F7A3E'],
    floor: '#4B3E27',
    trail: '#D8B878',
    sun: { cx: 60, cy: 10, r: 10 },
    shafts: true,
    motes: 8,
  },

  'shaded-hedge': {
    shape: 'forest',
    sky: ['#DCE9C0', '#A9C98C'],
    trees: ['#6E9E52', '#4A7742', '#2A4A2C'],
    floor: '#3A2F1E',
    trail: '#9C8256',
    // No sun: a hedgerow's shade, not a thicket's gloom — the sky stays green, not grey.
    motes: 3,
  },

  'hedge-canopy': {
    shape: 'canopy',
    sky: ['#EAF7FF', '#BFE3FF'],
    trees: ['#8FC168', '#5FA24C', '#3F7A3E'],
    motes: 6,
  },

  'tall-grass': {
    shape: 'floor',
    sky: ['#4C6B41', '#22331F'],
    floor: '#4B3E27',
    leaves: ['#8FA84A', '#6E9138', '#B7C465', '#5C7A2E', '#9CB050'],
    motes: 3,
  },

  // "El prat espurnejant" (pikafield.js) — the scrubland outside the Power Plant fence, told
  // as an overcast, storm-tinted field rather than a forest.
  'fence-morning': {
    shape: 'forest',
    sky: ['#FCEFD8', '#D7E3EE'],
    trees: ['#A7B978', '#7C9052', '#54692F'],
    floor: '#5A4E36',
    trail: '#B7A26B',
    sun: { cx: 46, cy: 15, r: 7 },
    motes: 4,
  },

  'field-bright': {
    shape: 'forest',
    sky: ['#FFF8D0', '#CFE0EF'],
    trees: ['#B7C67E', '#8CA45A', '#5E7A34'],
    floor: '#4E4530',
    trail: '#C6AE76',
    sun: { cx: 58, cy: 11, r: 9 },
    shafts: true,
    motes: 7,
  },

  'field-dusk': {
    shape: 'forest',
    sky: ['#3A4A5E', '#232F3D'],
    trees: ['#5A6B45', '#3E4C31', '#26301E'],
    floor: '#232019',
    trail: '#3B3527',
    // No sun: the storm has already swallowed it.
    motes: 3,
  },

  'storm-gap': {
    shape: 'canopy',
    sky: ['#EAF0FF', '#B9C7F2'],
    trees: ['#8894C4', '#5C6BA0', '#3B4676'],
    motes: 8,
  },

  'dry-litter': {
    shape: 'floor',
    sky: ['#3A4A2E', '#1C2318'],
    floor: '#3A3324',
    leaves: ['#C9B24A', '#A68A2E', '#E0CD6A', '#8C7328', '#B49A3E'],
    motes: 4,
  },
}

/** Fixed drift positions. Dust in a sunbeam in the forest, spores under the leaves. */
const MOTES = [
  { left: '18%', top: '26%', size: 0.9, delay: '0s', duration: '9s' },
  { left: '34%', top: '14%', size: 0.6, delay: '1.4s', duration: '11s' },
  { left: '52%', top: '32%', size: 1.1, delay: '0.7s', duration: '8s' },
  { left: '66%', top: '18%', size: 0.7, delay: '2.1s', duration: '12s' },
  { left: '78%', top: '38%', size: 0.9, delay: '1.1s', duration: '10s' },
  { left: '26%', top: '44%', size: 0.5, delay: '2.8s', duration: '13s' },
  { left: '88%', top: '24%', size: 0.8, delay: '0.4s', duration: '9.5s' },
  { left: '44%', top: '52%', size: 0.6, delay: '3.2s', duration: '11.5s' },
]

export default function Backdrop({ id, className = '' }) {
  // An unknown id is a content typo, and it costs atmosphere rather than playability — the
  // story still runs, so this falls back rather than failing. `verify` walks the graph for the
  // failures that actually strand a child: a broken `next` and an empty encounter pool.
  const scene = BACKDROPS[id] ?? BACKDROPS['forest-edge']

  return (
    <div
      className={[styles.backdrop, className].filter(Boolean).join(' ')}
      style={{ '--sky-top': scene.sky[0], '--sky-bottom': scene.sky[1] }}
      aria-hidden="true"
    >
      {/* `slice` rather than `meet`: the drawing is composed to be cropped, so it fills any
          iPad aspect without ever being stretched out of shape. `yMax` pins the ground. */}
      <svg className={styles.art} viewBox="0 0 100 62" preserveAspectRatio="xMidYMax slice">
        {scene.shape === 'forest' && <ForestShape {...scene} />}
        {scene.shape === 'canopy' && <CanopyShape {...scene} />}
        {scene.shape === 'floor' && <FloorShape {...scene} />}
      </svg>

      {scene.shape === 'image' && (
        <img
          className={styles.sceneImage}
          src={sceneUrl(scene.src)}
          alt=""
          draggable="false"
        />
      )}

      <div className={styles.motes}>
        {MOTES.slice(0, scene.motes ?? 0).map((mote, i) => (
          <span
            key={i}
            className={styles.mote}
            style={{
              left: mote.left,
              top: mote.top,
              '--mote-size': `${mote.size}vmin`,
              animationDelay: mote.delay,
              animationDuration: mote.duration,
            }}
          />
        ))}
      </div>

      {/* Darkens the lower half under the narration panel and the corners under the two
          buttons, in every backdrop. The scrim on the panel handles legibility; this handles
          the panel not looking pasted on. */}
      <div className={styles.vignette} />
    </div>
  )
}

/** x positions per treeline. Irregular on purpose — an even row reads as a fence. */
const FAR = [3, 12, 19, 28, 36, 44, 53, 61, 68, 77, 85, 93, 99]
const MID = [-2, 9, 17, 27, 38, 47, 58, 66, 75, 86, 96, 103]

/** The treeline from the path: three depths, a floor, and a trail heading into it. */
function ForestShape({ trees, floor, trail, sun, shafts }) {
  const horizon = 46

  return (
    <>
      {sun && (
        <>
          <circle cx={sun.cx} cy={sun.cy} r={sun.r * 2.6} fill="#FFF6D0" opacity="0.28" />
          <circle cx={sun.cx} cy={sun.cy} r={sun.r} fill="#FFF3B8" opacity="0.85" />
        </>
      )}

      {shafts && (
        <g fill="#FFFBE6" opacity="0.14">
          <polygon points="56,8 68,8 92,46 44,46" />
          <polygon points="34,8 41,8 52,46 22,46" />
        </g>
      )}

      {/* Far line: small, high, and hazier than the rest. */}
      <g fill={trees[0]} opacity="0.85">
        {FAR.map((x, i) => (
          <circle key={x} cx={x} cy={26 + (i % 3)} r={6 + (i % 4) * 0.9} />
        ))}
        <rect x="0" y="27" width="100" height={horizon - 27} />
      </g>

      {/* Middle line: the body of the forest. */}
      <g fill={trees[1]}>
        {MID.map((x, i) => (
          <circle key={x} cx={x} cy={32 + (i % 2) * 1.4} r={8.5 + (i % 3) * 1.4} />
        ))}
        <rect x="0" y="34" width="100" height={horizon - 34} />
      </g>

      {/* Near trees, at the edges only — they frame the scene and leave the middle for the
          trail, which is where the story is going. */}
      <g fill={trees[2]}>
        <circle cx="-2" cy="20" r="19" />
        <circle cx="9" cy="30" r="15" />
        <circle cx="102" cy="17" r="21" />
        <circle cx="90" cy="29" r="15" />
        <rect x="1" y="30" width="7" height={horizon - 28} rx="2" />
        <rect x="93" y="28" width="8" height={horizon - 26} rx="2" />
      </g>

      <rect x="0" y={horizon} width="100" height={62 - horizon} fill={floor} />
      {/* The trail, widening towards the viewer: the one bit of perspective in the drawing,
          and the reason the scene reads as "we are standing on a path". */}
      <polygon points={`41,${horizon} 60,${horizon} 90,62 10,62`} fill={trail} opacity="0.75" />
    </>
  )
}

/** Leaf clusters crowding in from every edge, with a gap of bright sky left in the middle. */
const CLUSTERS = [
  [-6, 2, 20],
  [14, -8, 18],
  [40, -12, 20],
  [66, -8, 17],
  [92, -4, 22],
  [106, 20, 20],
  [-8, 24, 18],
  [-2, 52, 20],
  [26, 62, 17],
  [58, 66, 19],
  [88, 58, 21],
  [108, 46, 18],
]

function CanopyShape({ trees }) {
  return (
    <>
      {/* The gap. Bright, central, and where the encounter art lands. */}
      <circle cx="52" cy="28" r="30" fill="#FFFFFF" opacity="0.35" />

      {/* Branches first, so the leaves sit on them. */}
      <g stroke="#43301C" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M-4 12 C22 18 44 8 74 16 100 22" strokeWidth="2.6" />
        <path d="M104 40 C78 44 58 54 30 50 4 44" strokeWidth="2" />
      </g>

      {CLUSTERS.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={trees[i % trees.length]} />
      ))}

      {/* A few individual leaves hanging into the gap, so the frame isn't a hard ring. */}
      <g fill={trees[1]} opacity="0.95">
        <ellipse cx="30" cy="16" rx="7" ry="3.4" transform="rotate(-24 30 16)" />
        <ellipse cx="74" cy="34" rx="6.5" ry="3.2" transform="rotate(18 74 34)" />
        <ellipse cx="46" cy="8" rx="6" ry="3" transform="rotate(-8 46 8)" />
      </g>
    </>
  )
}

/** Leaf litter from above: overlapping leaves, a couple of twigs, no horizon. */
const LITTER = [
  [10, 12, 9, 4.4, -22],
  [30, 6, 8, 4, 14],
  [52, 14, 10, 4.8, -8],
  [74, 8, 8.5, 4.2, 26],
  [92, 18, 9, 4.4, -34],
  [4, 30, 9.5, 4.6, 8],
  [22, 26, 8, 4, -40],
  [42, 32, 10, 5, 20],
  [64, 26, 9, 4.4, -14],
  [84, 34, 9.5, 4.6, 34],
  [14, 46, 10, 5, -6],
  [36, 52, 9, 4.4, 28],
  [58, 46, 10.5, 5.2, -26],
  [80, 54, 9, 4.4, 12],
  [98, 44, 9, 4.4, -18],
]

function FloorShape({ floor, leaves }) {
  return (
    <>
      <rect x="0" y="0" width="100" height="62" fill={floor} />

      <g stroke="#4A3A22" strokeLinecap="round" fill="none" opacity="0.8">
        <path d="M6 20 C26 24 44 18 62 24" strokeWidth="1.4" />
        <path d="M52 56 C66 50 78 52 96 46" strokeWidth="1.2" />
      </g>

      {LITTER.map(([cx, cy, rx, ry, rot], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill={leaves[i % leaves.length]}
          transform={`rotate(${rot} ${cx} ${cy})`}
        />
      ))}
    </>
  )
}
