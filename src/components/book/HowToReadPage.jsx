import styles from './HowToReadPage.module.css'

const ANNOTATIONS = [
  { n: 1,  label: 'Número de Pokédex',   desc: 'L\'índex oficial de la Pokédex Nacional, #001–151.' },
  { n: 2,  label: 'Nom',                 desc: 'Nom oficial tal com apareix als jocs.' },
  { n: 3,  label: 'Insígnies de tipus',  desc: 'Fins a dos tipus, que determinen les resistències i vulnerabilitats.' },
  { n: 4,  label: 'Categoria d\'espècie',desc: 'El descriptor d\'espècie de la Pokédex (p. ex. "Pokémon Ratolí").' },
  { n: 5,  label: 'Il·lustració oficial',desc: 'Il·lustració d\'alta resolució de la biblioteca d\'actius de The Pokémon Company.' },
  { n: 6,  label: 'Dades vitals',        desc: 'Altura, pes, habilitat, ràtio de gènere, taxa de captura i grups d\'ou.' },
  { n: 7,  label: 'Galeria de sprites',  desc: 'Sprites frontal, posterior, variocolor i variocolor posterior dels jocs.' },
  { n: 8,  label: 'Entrades de la Pokédex', desc: 'Text descriptiu de diverses versions dels jocs, mostrat en ordre.' },
  { n: 9,  label: 'Compatibilitat de tipus', desc: 'Tipus contra els quals aquest Pokémon és fort i tipus als quals és vulnerable.' },
  { n: 10, label: 'Estadístiques base',  desc: 'Sis estadístiques escalades a un màxim de 255, més el total d\'estadístiques base.' },
  { n: 11, label: 'Cadena evolutiva',    desc: 'Línia completa amb les condicions d\'evolució i sprites invertits.' },
  { n: 12, label: 'Llocs de captura',    desc: 'On trobar aquest Pokémon a Vermell, Blau o Groc.' },
]

function Num({ n }) {
  return <span className={styles.callout}>{n}</span>
}

export default function HowToReadPage({ pageNum }) {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <p className={styles.label}>Guia</p>
        <h1 className={styles.heading}>Com llegir una pàgina</h1>
        <div className={styles.rule} />
      </header>

      <div className={styles.main}>
        {/* ── Wireframe diagram ── */}
        <div className={styles.diagramWrap}>
          <div className={styles.mock}>

            {/* Mock header band */}
            <div className={styles.mockHeader}>
              <div className={styles.mockHeaderLeft}>
                <div className={styles.mockNum}>#025 <Num n={1} /></div>
                <div className={styles.mockBadgeRow}><div className={styles.mockBadge} /> <Num n={3} /></div>
              </div>
              <div className={styles.mockName}>PIKACHU <Num n={2} /></div>
              <div className={styles.mockCat}>Mouse Pkm. <Num n={4} /></div>
            </div>

            {/* Mock body */}
            <div className={styles.mockBody}>
              {/* Left col */}
              <div className={styles.mockLeft}>
                <div className={styles.mockArt}>
                  <span className={styles.mockArtLabel}>Art</span>
                  <Num n={5} />
                </div>
                <div className={styles.mockVitals}>
                  <Num n={6} />
                  <div className={styles.mockVitalRow}>Height · 0.4 m</div>
                  <div className={styles.mockVitalRow}>Weight · 6.0 kg</div>
                  <div className={styles.mockVitalRow}>Ability · Static</div>
                  <div className={styles.mockVitalRow}>Catch · 190</div>
                </div>
                <div className={styles.mockSprites}>
                  <Num n={7} />
                  <div className={styles.mockSpriteGrid}>
                    {['Frontal', 'Posterior', 'Variocolor', 'Vario.↩'].map(lbl => (
                      <div key={lbl} className={styles.mockSpriteCell}>
                        <div className={styles.mockSpriteBox} />
                        <span className={styles.mockSpriteLabel}>{lbl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right col */}
              <div className={styles.mockRight}>
                <div className={styles.mockFlavor}>
                  <Num n={8} />
                  <p className={styles.mockFlavorText}>
                    "De vegades usa una descàrrega elèctrica per recarregar un altre Pikachu que es troba en un estat debilitat..."
                  </p>
                </div>
                <div className={styles.mockMatchups}>
                  <Num n={9} />
                  <div className={styles.mockMatchRow}>
                    <span>Dèbil a</span>
                    <span className={styles.mockPill} />
                  </div>
                  <div className={styles.mockMatchRow}>
                    <span>Fort contra</span>
                    <span className={styles.mockPill} /><span className={styles.mockPill} />
                  </div>
                </div>
                <div className={styles.mockStats}>
                  <Num n={10} />
                  {[
                    { name: 'HP',  w: '14%' },
                    { name: 'ATK', w: '22%' },
                    { name: 'DEF', w: '16%' },
                    { name: 'SPD', w: '35%' },
                  ].map(s => (
                    <div key={s.name} className={styles.mockStatRow}>
                      <span>{s.name}</span>
                      <div className={styles.mockBarTrack}>
                        <div className={styles.mockBarFill} style={{ width: s.w }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mock footer band */}
            <div className={styles.mockFooter}>
              <div className={styles.mockEvo}>
                <Num n={11} />
                <span>Pikachu → Raichu</span>
              </div>
              <div className={styles.mockLocs}>
                <Num n={12} />
                <span>Viridian Forest</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className={styles.legend}>
          {ANNOTATIONS.map(a => (
            <div key={a.n} className={styles.legendItem}>
              <span className={styles.legendNum}>{a.n}</span>
              <div>
                <p className={styles.legendLabel}>{a.label}</p>
                <p className={styles.legendDesc}>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {pageNum && <div className={styles.pageNumBar}>{pageNum}</div>}
    </article>
  )
}
