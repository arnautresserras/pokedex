/**
 * "El camí de Pallet" — Red's own first walk, out of Pallet Town along Route 1 / Route 22.
 * Same five-scene fork shape as `forest.js` (a scenic fork, then a "look up" / "look down"
 * fork) — a proven topology, reused rather than reinvented. What doesn't reuse is the finish:
 * the forest is allowed to be the one story that just keeps meeting residents forever, so this
 * one's two encounters each name a `next` and hand off to a closing scene of their own —
 * `hedgetop` → `nest`, `grassnest` → `friend` — one per branch, so the two forks stay two
 * different walks all the way to the end rather than reconverging on the same reveal loop.
 */
export const ROUTE1 = {
  id: 'route1',
  start: 'road',
  // Emerald's Red back sprite — a different one than the forest's FRLG Red, so the two
  // stories don't look identical when played back to back.
  protagonist: 'e-red-back',
  scenes: {
    road: {
      backdrop: 'pallet-road',
      choices: [
        { icon: 'sunny-path', next: 'meadow' },
        { icon: 'dark-path', next: 'hedgerow' },
      ],
    },

    meadow: {
      backdrop: 'bright-meadow',
      choices: [
        { icon: 'branch', next: 'hedgetop' },
        { icon: 'leaves', next: 'grassnest' },
      ],
    },

    hedgerow: {
      backdrop: 'shaded-hedge',
      choices: [
        { icon: 'branch', next: 'hedgetop' },
        { icon: 'leaves', next: 'grassnest' },
      ],
    },

    hedgetop: { type: 'encounter', backdrop: 'hedge-canopy', pool: 'route1', next: 'nest' },
    grassnest: { type: 'encounter', backdrop: 'tall-grass', pool: 'route1', next: 'friend' },

    // The "shook the hedge" ending: whoever fell out goes back exactly where it was. A story
    // about a first walk out of town is a strange place to teach "look, don't take" — which is
    // exactly why it belongs here rather than in the forest, which has no room to teach it once
    // meeting somebody new is a button the child can press again.
    nest: { backdrop: 'bright-meadow', type: 'ending' },

    // The "looked under the grass" ending: nothing gets caught, and the walk continues with
    // company instead of a catch — a different lesson than the same fork's forest twin, where
    // looking under the leaves only ever leads to another reveal.
    friend: { backdrop: 'pallet-road', type: 'ending' },
  },
}
