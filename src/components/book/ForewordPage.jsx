import styles from './ForewordPage.module.css'

export default function ForewordPage() {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <p className={styles.label}>Pròleg</p>
        <h1 className={styles.heading}>La nostàlgia de tornar a casa</h1>
        <div className={styles.rule} />
      </header>

      <div className={styles.body}>
        <p>
          Construir aquest llibre ha estat un plaer alhora que un aprenentatge. Buscava un llibre enciclopèdic per poder compartir
          el meu amor pels Pokémon amb la Victòria, i no acabava de trobar res que em fes el pes.
          Una amiga em va dir, "Hauràs de fer-lo tu..." i així ho vaig fer. Gràcies Júlia per la idea, 
          tot i que potser n'hauràs de patir les conseqüències explicant-lo al Martí.
        </p>
        <p>
          Kanto va ser, i sempre serà, una mica com ser a casa. Recordo molts viatges amb cotxe descobrint aquells indrets.
          L'emoció d'escollir un Charmander per primer cop, o l'orgull de guanyar per primer cop una medalla.
        </p>
        <p>
          La idea d'aquest llibre és ben senzilla, intentar compartir aquests records amb la propera generació
          i amb l'esperança que també pugui ser un refugi per a ells.
          Intento donar a cadascun dels protagonistes d'aquesta aventura una pàgina que els faci justícia.
        </p>
        <footer className={styles.sig}>— Arnau, 2026</footer>
      </div>
    </article>
  )
}
