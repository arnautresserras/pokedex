import { TYPE_COLORS } from '../utils/typeColors'
import styles from './TypeBadge.module.css'

export default function TypeBadge({ type, small = false }) {
  const colors = TYPE_COLORS[type] ?? TYPE_COLORS.normal
  return (
    <span
      className={`${styles.badge}${small ? ' ' + styles.small : ''}`}
      style={{ '--badge-color': colors.primary, '--badge-text': '#fff' }}
    >
      {type.toUpperCase()}
    </span>
  )
}
