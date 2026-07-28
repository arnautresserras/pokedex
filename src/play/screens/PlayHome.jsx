import { useNavigate } from 'react-router-dom'
import { Tappable } from '../motion'
import { artUrl } from '../utils/playAssets'
import styles from './PlayHome.module.css'

/**
 * Placeholder home. Slice 2 replaces this with the real three-tile mode switcher
 * (Explore / Story / Game) — text-free and colour-coded. Until then it exists so /play
 * renders something, and so the motion lab is reachable on the iPad.
 */
export default function PlayHome() {
  const navigate = useNavigate()

  return (
    <div className={styles.home}>
      <img className={styles.art} src={artUrl(25)} alt="" />
      <h1 className={styles.title}>Pokédex</h1>
      <p className={styles.note}>
        Slice 1 · foundations. Els tres modes arriben aviat.
      </p>
      <div className={styles.links}>
        <Tappable className={styles.link} onTap={() => navigate('/play/motion')}>
          Motion lab
        </Tappable>
        <Tappable className={styles.link} onTap={() => navigate('/browse')}>
          Print book
        </Tappable>
      </div>
    </div>
  )
}
