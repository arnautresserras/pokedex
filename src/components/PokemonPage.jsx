import { getTypeColors } from '../utils/typeColors'
import { getTypeMatchups, getOffensiveMatchups } from '../utils/typeChart'
import { formatId, formatHeight, formatWeight, formatGender, paddedId } from '../utils/formatters'
import TypeBadge from './TypeBadge'
import StatBar from './StatBar'
import styles from './PokemonPage.module.css'

export default function PokemonPage({ pokemon }) {
  const primaryType = pokemon.types[0]
  const colors = getTypeColors(primaryType)
  const artUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedId(pokemon.id)}.png`
  const fallbackUrl = pokemon.sprites?.officialArtwork

  const totalBST = pokemon.stats.reduce((sum, s) => sum + s.value, 0)
  const { weak: typeWeak } = getTypeMatchups(pokemon.types)
  const typeStrongVs = getOffensiveMatchups(pokemon.types)

  const flavorTexts = pokemon.flavorTexts
    ?? (pokemon.flavorText ? [{ text: pokemon.flavorText, version: '' }] : [])

  return (
    <article
      className={styles.page}
      data-type={primaryType}
      style={{
        '--color-primary': colors.primary,
        '--color-light': colors.light,
        '--color-accent': colors.accent,
      }}
    >
      {/* Decorative watermark */}
      <div className={styles.watermark} aria-hidden="true">
        {primaryType.toUpperCase()}
      </div>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.number}>{formatId(pokemon.id)}</span>
          <div className={styles.types}>
            {pokemon.types.map(t => <TypeBadge key={t} type={t} />)}
          </div>
        </div>
        <h1 className={styles.name}>{pokemon.name}</h1>
        <span className={styles.category}>{pokemon.category}</span>
      </header>

      {/* ── BODY ── */}
      <div className={styles.body}>
        {/* Left column */}
        <div className={styles.leftCol}>
          <div className={styles.artWrapper}>
            <img
              className={styles.art}
              src={artUrl}
              onError={e => { e.currentTarget.src = fallbackUrl }}
              alt={pokemon.name}
            />
          </div>

          <dl className={styles.vitals}>
            <div className={styles.vitalRow}>
              <dt>Height</dt>
              <dd>{formatHeight(pokemon.height)}</dd>
            </div>
            <div className={styles.vitalRow}>
              <dt>Weight</dt>
              <dd>{formatWeight(pokemon.weight)}</dd>
            </div>
            <div className={styles.vitalRow}>
              <dt>Ability</dt>
              <dd>{pokemon.ability}</dd>
            </div>
            {pokemon.genderRate != null && (
              <div className={styles.vitalRow}>
                <dt>Gender</dt>
                <dd>{formatGender(pokemon.genderRate)}</dd>
              </div>
            )}
            {pokemon.captureRate != null && (
              <div className={styles.vitalRow}>
                <dt>Catch Rate</dt>
                <dd>{(pokemon.captureRate / 255 * 100).toFixed(1)}%</dd>
              </div>
            )}
            {pokemon.baseExperience != null && (
              <div className={styles.vitalRow}>
                <dt>Base EXP</dt>
                <dd>{pokemon.baseExperience}</dd>
              </div>
            )}
            {pokemon.growthRate && (
              <div className={styles.vitalRow}>
                <dt>Growth</dt>
                <dd>{pokemon.growthRate}</dd>
              </div>
            )}
            {pokemon.eggGroups?.length > 0 && (
              <div className={styles.vitalRow}>
                <dt>Egg Groups</dt>
                <dd>{pokemon.eggGroups.join(' · ')}</dd>
              </div>
            )}
          </dl>

          {/* Sprite gallery */}
          <div className={styles.spriteGallery}>
            <span className={styles.spriteGalleryLabel}>Sprites</span>
            <div className={styles.spriteGrid}>
              {[
                { url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,              label: 'Front' },
                { url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemon.id}.png`,         label: 'Back' },
                { url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`,        label: 'Shiny' },
                { url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${pokemon.id}.png`,   label: 'Shiny Back' },
              ].map(({ url, label }) => (
                <div key={label} className={styles.spriteItem}>
                  <img src={url} alt={`${pokemon.name} ${label}`} className={styles.gallerySprite} />
                  <span className={styles.spriteLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          {/* Flavor texts */}
          <div className={styles.flavorSection}>
            {flavorTexts.map(entry => (
              <blockquote key={entry.version || 'default'} className={styles.flavor}>
                <p className={styles.flavorText}>{entry.text}</p>
                {entry.version && (
                  <footer className={styles.flavorVersion}>— {entry.version}</footer>
                )}
              </blockquote>
            ))}
          </div>

          {/* Type matchups */}
          <div className={styles.matchups}>
            {typeStrongVs.length > 0 && (
              <div className={styles.matchupGroup}>
                <span className={styles.matchupLabel}>Strong vs</span>
                <div className={styles.matchupBadges}>
                  {typeStrongVs.map(type => (
                    <TypeBadge key={type} type={type} small />
                  ))}
                </div>
              </div>
            )}
            {typeWeak.length > 0 && (
              <div className={styles.matchupGroup}>
                <span className={styles.matchupLabel}>Weak to</span>
                <div className={styles.matchupBadges}>
                  {typeWeak.map(({ type }) => (
                    <TypeBadge key={type} type={type} small />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className={styles.statsSection}>
            <h2 className={styles.statsHeading}>Base Stats</h2>
            {pokemon.stats.map(s => (
              <StatBar
                key={s.name}
                name={s.name}
                value={s.value}
                accentColor={colors.accent}
              />
            ))}
            <div className={styles.bst}>
              <span className={styles.bstLabel}>TOTAL</span>
              <span className={styles.bstValue}>{totalBST}</span>
            </div>
          </div>

          {/* Notable moves */}
          {pokemon.moves?.length > 0 && (
            <div className={styles.movesSection}>
              <h2 className={styles.statsHeading}>Notable Moves</h2>
              {pokemon.moves.map(move => (
                <div key={move.name} className={styles.moveRow}>
                  <TypeBadge type={move.type} small />
                  <span className={styles.moveName}>{move.name}</span>
                  <span className={styles.movePower}>{move.power ?? '—'}</span>
                  <span className={styles.moveLearnAt}>{move.learnAt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.evoSection}>
          <h3 className={styles.footerLabel}>Evolution</h3>
          <div className={styles.evoChain}>
            {pokemon.evolutionChain.map((step, i) => {
              if (step.branches) {
                return (
                  <span key="branches" className={styles.evoBranches}>
                    {step.branches.map(branch => (
                      <span key={branch.id} className={styles.evoBranch}>
                        <span className={styles.evoArrow}>{branch.trigger}</span>
                        <img
                          className={styles.evoSprite}
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${branch.id}.png`}
                          alt={branch.name}
                        />
                        <span className={styles.evoName}>{branch.name}</span>
                      </span>
                    ))}
                  </span>
                )
              }
              return (
                <span key={step.id} className={styles.evoStep}>
                  {i > 0 && (
                    <span className={styles.evoArrow}>{step.trigger}</span>
                  )}
                  <img
                    className={styles.evoSprite}
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${step.id}.png`}
                    alt={step.name}
                  />
                  <span className={styles.evoName}>{step.name}</span>
                </span>
              )
            })}
          </div>
        </div>

        {pokemon.locations?.length > 0 && (
          <div className={styles.locations}>
            <h3 className={styles.footerLabel}>Locations</h3>
            <p className={styles.locationList}>{pokemon.locations.join(' · ')}</p>
          </div>
        )}
      </footer>
    </article>
  )
}
