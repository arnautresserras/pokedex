import styles from './ClosingPage.module.css'

export default function ClosingPage({ pageNum }) {
  return (
    <article className={styles.page}>
      <div className={styles.content}>
        <p className={styles.label}>Nota final</p>
        <div className={styles.rule} />
        <p className={styles.body}>
          Si has arribat fins aquí — des de Bulbasaur, passant per Mewtwo,
          fins al final del llibre — gràcies. Gràcies a la Marta, la Victòria i la Valentina per ajudar-me a fer friki
          i deixar-me dedicar temps a poder fer coses com aquest llibre.
        </p>
        <p className={styles.body}>
          És fàcil de subestimar aquests records formatius i aquestes vivències passades.
          Els Pokémon són personatges de jocs infantils, joguines de goma, cartes col·leccionables.
          Però hi ha una raó per la qual tanta gent que els va descobrir als vuit anys
          encara sent alguna cosa en veure els sprites originals. 
        </p>
        <p className={styles.body}>
          Per als curiosos del darrere de l'escenari: aquest llibre s'ha fet amb React, molt de CSS i una mica massa de temps xerrant amb el Claude.
          Les dades provenen de PokéAPI. Les opinions — sobre quins textos descriptius
          funcionen, quins dissenys aguanten el pas del temps, quina generació
          no serà mai superada — són totalment meves.
        </p>
        <p className={styles.sig}>Arnau Tresserras, 2026.</p>
      </div>
      {pageNum && <div className={styles.pageNumBar}>{pageNum}</div>}
    </article>
  )
}
