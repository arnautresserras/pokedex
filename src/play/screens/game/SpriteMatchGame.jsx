import { useState } from 'react'
import TypeStage from './TypeStage'
import AnswerOptions from './AnswerOptions'
import { spriteUrl } from '../../utils/playAssets'
import styles from './Game.module.css'

/**
 * "Troba el sprite" — the hero art on stage, three pixel sprites below, tap the one that's the
 * same Pokémon. The inverse lesson from Silhouette: there the same picture in two forms (black
 * shape, full colour) is the question; here two *different* pictures of the same Pokémon are,
 * which only works once a child already recognises Explore's sprites from the type-room grids.
 *
 * Reuses the same two pieces `FamilyGame` does: `TypeStage` for "show it in full colour, name
 * hidden until revealed" (there's no silhouette here either — the art itself is the given), and
 * `AnswerOptions` for the reveal grammar, just pointed at `spriteUrl` instead of its `artUrl`
 * default. `round` is `buildRound`'s own shape — the same distinctness ladder that keeps three
 * silhouette options visually apart keeps three sprites apart too, so no new round builder was
 * needed for this activity.
 */
export default function SpriteMatchGame({ round, onDone }) {
  const [picked, setPicked] = useState(null)
  const revealed = picked != null

  return (
    <>
      <TypeStage pokemon={round.answer} revealed={revealed} onNext={onDone} />
      <AnswerOptions
        options={round.options}
        answerId={round.answer.id}
        picked={picked}
        onPick={pokemon => setPicked(pokemon.id)}
        imageUrl={spriteUrl}
        pixelated
        source="game-sprite-option"
        className={styles.options}
      />
    </>
  )
}
