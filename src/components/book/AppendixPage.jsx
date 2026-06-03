import styles from './AppendixPage.module.css'
import { ALL_TYPES, getTypeMultiplier } from '../../utils/typeChart'
import { TYPE_COLORS } from '../../utils/typeColors'
import { formatId } from '../../utils/formatters'

const TYPE_ABBR = {
  normal:   'NOR', fire:     'FIR', water:    'WAT',
  electric: 'ELC', grass:    'GRS', ice:      'ICE',
  fighting: 'FGT', poison:   'PSN', ground:   'GND',
  flying:   'FLY', psychic:  'PSY', bug:      'BUG',
  rock:     'ROC', ghost:    'GHO', dragon:   'DRG',
}

const STAT_NAMES = [
  'hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed',
]

const STAT_LABELS = {
  'hp':              'HP',
  'attack':          'Attack',
  'defense':         'Defense',
  'special-attack':  'Sp. Atk',
  'special-defense': 'Sp. Def',
  'speed':           'Speed',
}

function cellStyle(m) {
  if (m === 0)    return styles.cellImmune
  if (m >= 2)     return styles.cellWeak
  if (m < 1)      return styles.cellResist
  return styles.cellNormal
}

function cellText(m) {
  if (m === 0)    return '0'
  if (m === 4)    return '4×'
  if (m === 2)    return '2×'
  if (m === 0.25) return '/4'
  if (m === 0.5)  return '/2'
  return ''
}

function TypeBadge({ type }) {
  return (
    <span
      className={styles.typeBadge}
      style={{ background: TYPE_COLORS[type]?.primary ?? '#999' }}
    >
      {TYPE_ABBR[type]}
    </span>
  )
}

function TypeChartPage({ pageNum }) {
  return (
    <article className={styles.page}>
      <header className={styles.sheetHeader}>
        <p className={styles.label}>Apèndix A</p>
        <h2 className={styles.heading}>Taula d'avantadges per tipus</h2>
        <div className={styles.rule} />
        <p className={styles.hint}>Row = Tipus atacant · Column = Tipus defensor · Mecàniques Gen I</p>
      </header>

      <div className={styles.chartWrap}>
        <table className={styles.chart}>
          <thead>
            <tr>
              <th className={styles.cornerCell}>ATK↓ DEF→</th>
              {ALL_TYPES.map(def => (
                <th key={def} className={styles.colHead}>
                  <TypeBadge type={def} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_TYPES.map(atk => (
              <tr key={atk}>
                <td className={styles.rowHead}>
                  <TypeBadge type={atk} />
                </td>
                {ALL_TYPES.map(def => {
                  const m = getTypeMultiplier(atk, def)
                  return (
                    <td key={def} className={`${styles.cell} ${cellStyle(m)}`}>
                      {cellText(m)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.chartLegend}>
        <span className={`${styles.legendChip} ${styles.cellWeak}`}>2× — Molt efectiu</span>
        <span className={`${styles.legendChip} ${styles.cellResist}`}>/2 — No gaire efectiu</span>
        <span className={`${styles.legendChip} ${styles.cellImmune}`}>0 — Cap efecte</span>
        <span className={`${styles.legendChip} ${styles.cellNormal}`}>(res) — Atac normal</span>
      </div>

      {pageNum && <div className={styles.pageNumBar}>{pageNum}</div>}
    </article>
  )
}

function StatRankingsPage({ pokemon, pageNum }) {
  return (
    <article className={styles.page}>
      <header className={styles.sheetHeader}>
        <p className={styles.label}>Apèndix B</p>
        <h2 className={styles.heading}>Classificacions segons estadístiques base</h2>
        <div className={styles.rule} />
        <p className={styles.hint}>Top 10 Pokémon segons cada estadística base · Generació I (#001–#151)</p>
      </header>

      <div className={styles.statsGrid}>
        {STAT_NAMES.map(statName => {
          const sorted = [...pokemon]
            .map(p => ({
              id: p.id,
              name: p.name,
              value: p.stats.find(s => s.name === statName)?.value ?? 0,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10)

          return (
            <div key={statName} className={styles.statSection}>
              <h3 className={styles.statHeading}>{STAT_LABELS[statName]}</h3>
              {sorted.map((entry, i) => (
                <div key={entry.id} className={styles.statRow}>
                  <span className={styles.statRank}>{i + 1}</span>
                  <span className={styles.statName}>{entry.name}</span>
                  <div className={styles.statBarTrack}>
                    <div
                      className={styles.statBarFill}
                      style={{ width: `${(entry.value / 255) * 100}%` }}
                    />
                  </div>
                  <span className={styles.statValue}>{entry.value}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {pageNum && <div className={styles.pageNumBar}>{pageNum}</div>}
    </article>
  )
}

export default function AppendixPage({ pokemon, startPage }) {
  return (
    <>
      <TypeChartPage pageNum={startPage} />
      <StatRankingsPage pokemon={pokemon} pageNum={startPage ? startPage + 1 : undefined} />
    </>
  )
}
