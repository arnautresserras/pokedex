import styles from './PokedexGridPage.module.css'
import { TYPE_COLORS } from '../../utils/typeColors'
import { formatId } from '../../utils/formatters'

// Book page for Pokémon id N = 4 + N  (HowToRead=1, 3 grid pages=2-4, #001=5)
const pokemonBookPage = id => 4 + id

function GridCell({ pokemon }) {
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
  return (
    <div className={styles.cell}>
      <img
        className={styles.sprite}
        src={spriteUrl}
        alt={pokemon.name}
      />
      <span className={styles.num}>{formatId(pokemon.id)}</span>
      <span className={styles.name}>{pokemon.name}</span>
      <div className={styles.types}>
        {pokemon.types.map(t => (
          <span
            key={t}
            className={styles.typePip}
            style={{ background: TYPE_COLORS[t]?.primary ?? '#999' }}
          />
        ))}
      </div>
      <span className={styles.pageRef}>p. {pokemonBookPage(pokemon.id)}</span>
    </div>
  )
}

function GridSheet({ pokemon, pageNum }) {
  const first = formatId(pokemon[0]?.id)
  const last = formatId(pokemon[pokemon.length - 1]?.id)
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <h2 className={styles.title}>Pokédex</h2>
        <span className={styles.subtitle}>Generació I · {first} – {last}</span>
      </header>
      <div className={styles.grid}>
        {pokemon.map(p => <GridCell key={p.id} pokemon={p} />)}
      </div>
      {pageNum && <span className={styles.pageNum}>{pageNum}</span>}
    </article>
  )
}

export default function PokedexGridPage({ pokemon, startPage }) {
  const size = Math.ceil(pokemon.length / 3)
  const pages = [
    pokemon.slice(0, size),
    pokemon.slice(size, size * 2),
    pokemon.slice(size * 2),
  ]
  return (
    <>
      {pages.map((chunk, i) => (
        <GridSheet key={i} pokemon={chunk} pageNum={startPage ? startPage + i : undefined} />
      ))}
    </>
  )
}
