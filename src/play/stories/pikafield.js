/**
 * "El prat espurnejant" — Pikachu leads the way through the scrubby field outside the Power
 * Plant fence. Same five-scene fork shape as `forest.js`/`route1.js`, told with a storm-lit
 * field instead of a forest — but, like `route1.js`, its two encounters each hand off to their
 * own closing scene (`skycrackle` → `clearing`, `grasshum` → `quiet`) instead of the forest's
 * open-ended "meet another resident" loop, so the storm and the field each get a real finish.
 *
 * `protagonist` is `{ pokemon: 25 }` rather than a `peopleSprites` id — Pikachu is its own
 * trail companion here, not a person. See `Protagonist.jsx` for the two supported shapes.
 */
export const PIKAFIELD = {
  id: 'pikafield',
  start: 'gate',
  protagonist: { pokemon: 25 },
  scenes: {
    gate: {
      backdrop: 'fence-morning',
      choices: [
        { icon: 'sunny-path', next: 'openfield' },
        { icon: 'dark-path', next: 'wireshade' },
      ],
    },

    openfield: {
      backdrop: 'field-bright',
      choices: [
        { icon: 'cloud-gap', next: 'skycrackle' },
        { icon: 'grass-ripple', next: 'grasshum' },
      ],
    },

    wireshade: {
      backdrop: 'field-dusk',
      choices: [
        { icon: 'cloud-gap', next: 'skycrackle' },
        { icon: 'grass-ripple', next: 'grasshum' },
      ],
    },

    skycrackle: {
      type: 'encounter',
      backdrop: 'storm-gap',
      pool: 'plant-fence',
      next: 'clearing',
    },
    grasshum: { type: 'encounter', backdrop: 'dry-litter', pool: 'plant-fence', next: 'quiet' },

    // The "looked at the sky" ending: the storm that never quite broke passes over instead —
    // Pikachu's own weather calming down alongside the child's, which only this story can do.
    clearing: { backdrop: 'field-bright', type: 'ending' },

    // The "looked at the grass" ending: nothing caught, just noise that stops on its own — a
    // small lesson in patience that the sky-branch's ending doesn't teach.
    quiet: { backdrop: 'field-dusk', type: 'ending' },
  },
}
