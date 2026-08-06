import { useNavigate } from 'react-router-dom'
import { Tappable, SceneTransition } from '../motion'
import { ModeGlyph } from '../components'
import { MODES, modeCssVars, modePath } from '../modes'
import styles from './PlayHome.module.css'

/**
 * The mode switcher, and the first thing the app opens to.
 *
 * Four tiles, nothing else: one screenful, no scroll, no chrome, no decision that needs
 * reading. Each fills a quarter of the screen because the P0 criterion is that a non-reader
 * finds every mode unaided — at that size the pictogram is legible from a parent's lap and
 * every tile is a tap target several times over.
 *
 * The tiles are the only thing a child should find here. The two parent-facing links (motion
 * lab, print book) are pinned in a corner at a *deliberately small* size — the same "small
 * target is the deterrent" pattern the spec settles on for Story's parent controls, and the
 * reason they're allowed to be plain text.
 */
export default function PlayHome() {
  const navigate = useNavigate()

  return (
    <SceneTransition sceneKey="home" direction="none" className={styles.home}>
      <div className={styles.tiles}>
        {MODES.map(mode => (
          <Tappable
            key={mode.id}
            className={styles.tile}
            style={modeCssVars(mode)}
            // Tiles are big, so the press scale has to be small: 0.94 on a third of the
            // screen is a lurch, and it would clip its neighbours.
            pressScale={0.975}
            onTap={() => navigate(modePath(mode))}
            aria-label={mode.label}
          >
            <span className={styles.glyphBox}>
              <ModeGlyph mode={mode.id} />
            </span>
            <span className={styles.label}>{mode.label}</span>
          </Tappable>
        ))}
      </div>

      <div className={styles.parentLinks}>
        <Tappable className={styles.parentLink} onTap={() => navigate('/play/motion')}>
          Motion lab
        </Tappable>
        <Tappable className={styles.parentLink} onTap={() => navigate('/browse')}>
          Llibre
        </Tappable>
      </div>
    </SceneTransition>
  )
}
