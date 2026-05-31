import { STAT_LABELS } from '../utils/formatters'
import styles from './StatBar.module.css'

const MAX_STAT = 255

export default function StatBar({ name, value, accentColor }) {
  const pct = Math.round((value / MAX_STAT) * 100)
  const label = STAT_LABELS[name] ?? name.toUpperCase()
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, background: accentColor }}
        />
      </div>
    </div>
  )
}
