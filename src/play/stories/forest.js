/**
 * "El bosc de Viridian" — the graph, with none of the words in it.
 *
 * A story is split in two files on purpose: this one is the *shape* (which scene follows
 * which, which backdrop, which choice pictogram, where the encounter pool comes from) and
 * `forest.ca.js` is the *prose*. The spec's P2 asks for Spanish and English later, and the
 * cheap version of that is a sibling text file — but only if a translator can't accidentally
 * fork the branching while retyping it. So the graph exists once and the words exist per
 * language; `index.js` joins them.
 *
 * Five scenes, two branch points, both paths reaching both endings:
 *
 *              ┌── sunlit ──┐
 *       edge ──┤            ├── canopy   (encounter, looking up)
 *              └── thicket ─┘── litter   (encounter, looking down)
 *
 * The first branch is atmosphere — sun or shade, the same forest told two ways — and the
 * paths reconverge because four hand-authored endings would be four half-written ones. The
 * second branch is the one that pays out: look up, or look under. Both are things a
 * 4-year-old has done in a real forest, which is what makes them guessable as pictures.
 *
 * `pool` is a *place*, not a hand-picked cast — see `utils/encounters.js`. Both endings draw
 * from the same forest because both happen in the same forest; sorting the pool into
 * canopy-dwellers and ground-dwellers would mean inventing habitat data the cache doesn't
 * have.
 */
export const FOREST = {
  id: 'forest',
  start: 'edge',
  scenes: {
    edge: {
      backdrop: 'forest-edge',
      choices: [
        { icon: 'sunny-path', next: 'sunlit' },
        { icon: 'dark-path', next: 'thicket' },
      ],
    },

    sunlit: {
      backdrop: 'sunlit-path',
      choices: [
        { icon: 'branch', next: 'canopy' },
        { icon: 'leaves', next: 'litter' },
      ],
    },

    thicket: {
      backdrop: 'dark-thicket',
      choices: [
        { icon: 'branch', next: 'canopy' },
        { icon: 'leaves', next: 'litter' },
      ],
    },

    canopy: { type: 'encounter', backdrop: 'canopy', pool: 'forest' },
    litter: { type: 'encounter', backdrop: 'leaf-floor', pool: 'forest' },
  },
}
