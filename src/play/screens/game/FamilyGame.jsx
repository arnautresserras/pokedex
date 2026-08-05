import { useState } from 'react'
import TypeStage from './TypeStage'
import AnswerOptions from './AnswerOptions'
import styles from './Game.module.css'

/**
 * "Qui és de la família?" as a self-contained activity. The stage is `TypeStage` reused as-is
 * — its job (full-colour art, name hidden until revealed, light pool takes the shown Pokémon's
 * colour) is exactly right for `round.prompt` too, and the options below are ordinary Pokémon
 * art the same way `SilhouetteGame`'s are, so `AnswerOptions` needs no changes either. The only
 * thing this file adds is wiring `round.prompt` and `round.answer` to the right slot.
 */
export default function FamilyGame({ round, onDone }) {
  const [picked, setPicked] = useState(null)
  const revealed = picked != null

  return (
    <>
      <TypeStage pokemon={round.prompt} revealed={revealed} onNext={onDone} />
      <AnswerOptions
        options={round.options}
        answerId={round.answer.id}
        picked={picked}
        onPick={pokemon => setPicked(pokemon.id)}
        className={styles.options}
      />
    </>
  )
}
