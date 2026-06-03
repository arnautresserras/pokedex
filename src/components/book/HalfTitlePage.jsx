import styles from './HalfTitlePage.module.css'

export default function HalfTitlePage() {
  return (
    <article className={styles.page}>
      <div className={styles.center}>
        <p className={styles.eyebrow}>Generation I</p>
        <h1 className={styles.title}>Pokédex</h1>
      </div>
    </article>
  )
}
