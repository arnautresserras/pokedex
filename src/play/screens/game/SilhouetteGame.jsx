import { useState } from 'react'
import SilhouetteStage from './SilhouetteStage'
import AnswerOptions from './AnswerOptions'
import styles from './Game.module.css'

/**
 * "Who's that Pokémon?" as a self-contained activity — `Game` mounts this fresh every round
 * (keyed on `roundNo`), so `picked` needs no reset logic of its own.
 */
export default function SilhouetteGame({ round, onDone }) {
  const [picked, setPicked] = useState(null)
  const revealed = picked != null

  return (
    <>
      <SilhouetteStage pokemon={round.answer} revealed={revealed} onNext={onDone} />
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
