import { useState } from 'react'
import { pokemonTypes } from '../../utils/playColors'
import TypeStage from './TypeStage'
import TypeOptions from './TypeOptions'
import styles from './Game.module.css'

/** "Quin color?" as a self-contained activity — see `SilhouetteGame`'s note on the remount. */
export default function TypeGame({ round, onDone }) {
  const [picked, setPicked] = useState(null)
  const revealed = picked != null

  return (
    <>
      <TypeStage pokemon={round.answer} revealed={revealed} onNext={onDone} />
      <TypeOptions
        options={round.options}
        answerType={pokemonTypes(round.answer)[0]}
        picked={picked}
        onPick={type => setPicked(type)}
        className={styles.options}
      />
    </>
  )
}
