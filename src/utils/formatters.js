export function formatId(id) {
  return `#${String(id).padStart(3, '0')}`
}

export function formatHeight(decimetres) {
  const m = decimetres / 10
  const ft = Math.floor(m / 0.3048)
  const inches = Math.round((m / 0.3048 - ft) * 12)
  return `${m.toFixed(1)} m (${ft}′${inches}″)`
}

export function formatWeight(hectograms) {
  const kg = hectograms / 10
  const lbs = (kg * 2.20462).toFixed(1)
  return `${kg.toFixed(1)} kg (${lbs} lbs)`
}

export const STAT_LABELS = {
  hp:              'HP',
  attack:          'ATK',
  defense:         'DEF',
  'special-attack':  'SP.ATK',
  'special-defense': 'SP.DEF',
  speed:           'SPD',
}

export function paddedId(id) {
  return String(id).padStart(3, '0')
}

// gender_rate: -1 = genderless; 0–8 = eighths that are female
export function formatGender(rate) {
  if (rate === -1) return 'Genderless'
  if (rate === 0)  return '100% ♂'
  if (rate === 8)  return '100% ♀'
  const f = rate / 8 * 100
  return `${100 - f}% ♂ · ${f}% ♀`
}
