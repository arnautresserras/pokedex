import { Tappable } from '../../motion'
import { artUrl } from '../../utils/playAssets'
import { onPokemonTap } from '../../utils/onPokemonTap'
import styles from './AnswerOptions.module.css'

/**
 * The three answers. Full-colour art of the same three Pokémon the round was built from, so the
 * task is "find this shape" and needs no reading — see `rounds.js` for why the options are
 * pictures and why they're guaranteed to look different from each other.
 *
 * **No fail state, and no correct-answer state either until one is tapped.** All three cells are
 * identical while asking — same size, same surface, same mode colour. Nothing about the layout
 * hints at the answer, and nothing about a wrong tap is punished:
 *
 *   right → the tapped cell is the marked one, and it's the one that stays lit
 *   wrong → the tapped cell steps quietly back, and the *answer* lights up instead
 *
 * A wrong tap gets no red, no cross, no shake. It gets a slightly dimmer cell and a ring around
 * the right one, which is honest — the child did point at the wrong shape and the point of the
 * game is learning which was right — without a signal a 4-year-old would read as failure. The
 * celebration on the stage above fires either way, per the plan.
 *
 * The mark is a **static ring plus a tick**, not an animation, so it survives
 * `prefers-reduced-motion` intact: the round's outcome must never be carried by motion alone.
 *
 * `imageUrl` defaults to `artUrl` — the hero-art options every other activity here uses — but
 * `SpriteMatchGame` passes `spriteUrl` and `pixelated` instead: same options grid, same reveal
 * grammar, the only thing that changes is which vendored image a cell shows.
 */
export default function AnswerOptions({
  options,
  answerId,
  picked,
  onPick,
  className = '',
  imageUrl = artUrl,
  pixelated = false,
  source = 'game-option',
}) {
  const revealed = picked != null

  return (
    <div className={[styles.options, className].filter(Boolean).join(' ')}>
      {options.map(pokemon => {
        const isAnswer = pokemon.id === answerId
        const classes = [
          styles.option,
          revealed && isAnswer ? styles.correct : '',
          revealed && !isAnswer ? styles.faded : '',
          revealed && !isAnswer && pokemon.id === picked ? styles.chosen : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <Tappable
            key={pokemon.id}
            className={classes}
            disabled={revealed}
            onTap={() => onPokemonTap(pokemon, { source, then: onPick })}
            aria-label={pokemon.name}
          >
            <img
              className={[styles.art, pixelated ? styles.pixelated : ''].filter(Boolean).join(' ')}
              src={imageUrl(pokemon.id)}
              alt=""
              draggable="false"
            />
            {/* For the parent to read aloud and for the shape a child will come to recognise —
                the same bargain the room cells and the mode tiles make. Never the affordance. */}
            <span className={styles.name}>{pokemon.name}</span>

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
