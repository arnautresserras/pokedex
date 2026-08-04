import { Tappable } from '../../motion'
import { getPlayTypeColors } from '../../utils/playColors'
import { getTypeRoom } from '../../typeRooms'
import { TypeGlyph } from '../../components'
import styles from './TypeOptions.module.css'

/**
 * The three answers for "Quin color?" — `AnswerOptions`' sibling. Same reveal grammar (a static
 * ring and tick on the right one, a quiet fade on the others, nothing that reads as a penalty),
 * but the tiles are type pictograms in their own colour rather than Pokémon art: the thing being
 * matched here is the colour itself, the same currency Explore's room tiles trade in.
 */
export default function TypeOptions({ options, answerType, picked, onPick, className = '' }) {
  const revealed = picked != null

  return (
    <div className={[styles.options, className].filter(Boolean).join(' ')}>
      {options.map(type => {
        const room = getTypeRoom(type)
        if (!room) return null

        const isAnswer = type === answerType
        const { primary, light } = getPlayTypeColors(type)
        const classes = [
          styles.option,
          revealed && isAnswer ? styles.correct : '',
          revealed && !isAnswer ? styles.faded : '',
          revealed && !isAnswer && type === picked ? styles.chosen : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <Tappable
            key={type}
            className={classes}
            style={{ '--tile-primary': primary, '--tile-light': light }}
            disabled={revealed}
            onTap={() => onPick(type)}
            aria-label={room.label}
          >
            <span className={styles.glyphBox}>
              <TypeGlyph type={type} />
            </span>
            <span className={styles.name}>{room.label}</span>

            {revealed && isAnswer && (
              <span className={styles.tick} aria-hidden="true">
                <svg viewBox="0 0 32 32">
                  <path
                    d="M7 17l6 6L25 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </Tappable>
        )
      })}
    </div>
  )
}
