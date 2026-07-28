import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tappable, Celebrate, SceneTransition, useReducedMotion } from '../motion'
import { usePokemon } from '../../hooks/usePokemon'
import { artUrl, spriteUrl } from '../utils/playAssets'
import { pokemonColors, typeCssVars, pokemonTypes } from '../utils/playColors'
import { onPokemonTap } from '../utils/onPokemonTap'
import styles from './MotionLab.module.css'

/**
 * Slice 0's motion spike, kept in the app rather than thrown away — every primitive the
 * three modes depend on, side by side, testable on the real iPad while muted.
 *
 * It answers the spec's open question ("is a visual-only reveal satisfying for a
 * 4-year-old?") by being handed to the actual users, and it's the fastest way to spot a
 * regression in the shared feedback layer later.
 */

const TAP_TILES = [25, 6, 9, 94] // Pikachu, Charizard, Blastoise, Gengar — four distinct colours
const SCENES = [1, 4, 7, 133]

export default function MotionLab() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()

  const [lastTapped, setLastTapped] = useState(null)
  const [celebrating, setCelebrating] = useState(false)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [direction, setDirection] = useState('forward')

  const star = usePokemon(25)
  const scenePokemon = usePokemon(SCENES[sceneIndex])
  const sceneColors = pokemonColors(scenePokemon)

  const advance = step => {
    setDirection(step > 0 ? 'forward' : 'back')
    setSceneIndex(i => (i + step + SCENES.length) % SCENES.length)
  }

  return (
    <div className={styles.lab}>
      <header className={styles.header}>
        <Tappable className={styles.back} onTap={() => navigate('/play')} aria-label="Back">
          ‹
        </Tappable>
        <h1 className={styles.title}>Motion lab</h1>
        <span className={styles.flag} data-on={reduced}>
          {reduced ? 'reduced motion' : 'full motion'}
        </span>
      </header>

      <section className={styles.section}>
        <h2 className={styles.h2}>1 · Tap acknowledgement</h2>
        <p className={styles.hint}>
          Must feel instant and unmistakable with the iPad muted.
          {lastTapped ? ` Últim: ${lastTapped}` : ''}
        </p>
        <div className={styles.tiles}>
          {TAP_TILES.map(id => (
            <TapTile key={id} id={id} onTapped={setLastTapped} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>2 · Celebration</h2>
        <p className={styles.hint}>
          The entire payoff of a correct guess, with no sound to help it.
        </p>
        <Celebrate
          active={celebrating}
          color={pokemonColors(star).primary}
          className={styles.celebrateBox}
          onDone={() => setCelebrating(false)}
        >
          <Tappable
            className={styles.celebrateTarget}
            style={typeCssVars(pokemonTypes(star)[0])}
            onTap={() => setCelebrating(true)}
          >
            <img className={styles.celebrateArt} src={artUrl(25)} alt="" />
          </Tappable>
        </Celebrate>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>3 · Scene transition</h2>
        <p className={styles.hint}>Card, story scene, and evolution step all use this.</p>
        <div
          className={styles.sceneFrame}
          style={{ ...typeCssVars(pokemonTypes(scenePokemon)[0]), '--tint': sceneColors.primary }}
        >
          <SceneTransition sceneKey={SCENES[sceneIndex]} direction={direction}>
            <div className={styles.scene}>
              <img className={styles.sceneArt} src={artUrl(SCENES[sceneIndex])} alt="" />
              <span className={styles.sceneName}>{scenePokemon.name}</span>
            </div>
          </SceneTransition>
        </div>
        <div className={styles.sceneControls}>
          <Tappable className={styles.stepButton} onTap={() => advance(-1)} aria-label="Previous">
            ‹
          </Tappable>
          <Tappable className={styles.stepButton} onTap={() => advance(1)} aria-label="Next">
            ›
          </Tappable>
        </div>
      </section>
    </div>
  )
}

function TapTile({ id, onTapped }) {
  const pokemon = usePokemon(id)
  return (
    <Tappable
      className={styles.tile}
      style={typeCssVars(pokemonTypes(pokemon)[0])}
      onTap={() => onPokemonTap(pokemon, { source: 'motion-lab', then: p => onTapped(p.name) })}
    >
      <img className={styles.tileSprite} src={spriteUrl(id)} alt="" />
    </Tappable>
  )
}
