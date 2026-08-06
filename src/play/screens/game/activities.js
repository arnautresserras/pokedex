import {
  buildRound,
  buildTypeRound,
  buildFamilyRound,
  buildEvolutionRound,
  buildMemoryRound,
  buildJigsawRound,
} from '../../utils/rounds'
import SilhouetteGame from './SilhouetteGame'
import TypeGame from './TypeGame'
import FamilyGame from './FamilyGame'
import EvolutionOrderGame from './EvolutionOrderGame'
import MemoryGame from './MemoryGame'
import SpriteMatchGame from './SpriteMatchGame'
import JigsawGame from './JigsawGame'

/**
 * The activities Game can ask, as data — `modes.js`'s pattern one level down: an activity's
 * identity (label, pictogram, round builder, the component that plays it) lives in exactly one
 * place, so `GameIndex` and `GameRound` both read from here instead of each carrying their own
 * list that could drift out of sync.
 *
 * Every `build` function shares one contract: `(roster, { recent }) => { ...roundData,
 * recentIds }`. That's what lets `GameRound` stay activity-agnostic — it never inspects a
 * round's shape, only forwards it to the matching `Component` and folds `recentIds` into the
 * exclusion list.
 */
export const ACTIVITIES = {
  silhouette: {
    label: 'Endevina el Pokémon',
    build: buildRound,
    Component: SilhouetteGame,
  },
  type: {
    label: 'Endevina el color',
    build: buildTypeRound,
    Component: TypeGame,
  },
  family: {
    label: 'Qui és de la família?',
    build: buildFamilyRound,
    Component: FamilyGame,
  },
  evolution: {
    label: "Ordena l'evolució",
    build: buildEvolutionRound,
    Component: EvolutionOrderGame,
  },
  memory: {
    label: 'Memory',
    build: buildMemoryRound,
    Component: MemoryGame,
  },
  sprite: {
    label: 'Troba el sprite',
    build: buildRound,
    Component: SpriteMatchGame,
  },
  jigsaw: {
    label: 'Trenca-closques',
    build: buildJigsawRound,
    Component: JigsawGame,
  },
}

/** Iteration order for `GameIndex`'s tiles and for "mix"'s random pick. */
export const ACTIVITY_KEYS = Object.keys(ACTIVITIES)

/** `/play/game/<key>` — 'mix' included, so a shuffled round is a real, linkable route too. */
export function activityPath(key) {
  return `/play/game/${key}`
}
