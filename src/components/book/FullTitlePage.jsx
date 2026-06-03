import styles from './FullTitlePage.module.css'
import { TYPE_COLORS } from '../../utils/typeColors'

const TYPE_ORDER = [
  'fire', 'water', 'grass', 'electric', 'psychic',
  'ghost', 'dragon', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'bug', 'rock', 'normal',
]

export default function FullTitlePage() {
  return (
    <article className={styles.page}>
      <div className={styles.typeBar}>
        {TYPE_ORDER.map(t => (
          <div
            key={t}
            className={styles.typeSlice}
            style={{ background: TYPE_COLORS[t].primary }}
          />
        ))}
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Pokédex</h1>
        <p className={styles.tagline}>
          Una enciclopedia il·lustrada<br />dels 151 Pokémon Originals
        </p>
        <div className={styles.rule} />
        <p className={styles.author}>Arnau Tresserras</p>
      </div>

      <div className={styles.footer}>
        <span className={styles.year}>2026</span>
      </div>
    </article>
  )
}
