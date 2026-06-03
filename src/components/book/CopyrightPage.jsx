import styles from './CopyrightPage.module.css'

export default function CopyrightPage() {
  return (
    <article className={styles.page}>
      <div className={styles.content}>
        <p className={styles.title}>Pokédex: Generació I</p>

        <p className={styles.body}>
          Primera edició, 2026.<br />
          Dissenyat i compilat per Arnau Tresserras.
        </p>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Fonts de dades</p>
          <p className={styles.body}>
            Dades de Pokémon extretes de PokéAPI (pokeapi.co), disponibles
            sota la llicència Creative Commons Reconeixement-NoComercial-
            CompartirIgual 3.0 No adaptada. Il·lustracions oficials de Pokémon
            de la biblioteca d'actius internacionals de The Pokémon Company.
          </p>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Avís legal</p>
          <p className={styles.body}>
            Pokémon i tots els noms, personatges i imatges relacionats són
            marques registrades de Nintendo, Game Freak i Creatures Inc.
            Aquest llibre és una publicació de fan no oficial produïda
            únicament per a ús personal i no comercial.
          </p>
        </div>
      </div>
    </article>
  )
}
