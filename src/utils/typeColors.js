export const TYPE_COLORS = {
  normal:   { primary: '#A8A878', light: '#F5F5F0', accent: '#6D6D4E' },
  fire:     { primary: '#FF6B35', light: '#FFF0EB', accent: '#C73E00' },
  water:    { primary: '#4A90D9', light: '#EBF4FF', accent: '#1A5FA0' },
  grass:    { primary: '#5DB85A', light: '#EDFAED', accent: '#2D7A2A' },
  electric: { primary: '#F4D03F', light: '#FFFDE7', accent: '#B7950B' },
  ice:      { primary: '#74CCF4', light: '#E8F8FE', accent: '#2980B9' },
  fighting: { primary: '#C03028', light: '#FDECEA', accent: '#7B1A14' },
  poison:   { primary: '#9B59B6', light: '#F5EDFB', accent: '#6C3483' },
  ground:   { primary: '#C9A84C', light: '#FBF5E6', accent: '#7D6608' },
  flying:   { primary: '#6C8FD4', light: '#EEF2FB', accent: '#2C4A8C' },
  psychic:  { primary: '#E91E8C', light: '#FDE8F3', accent: '#9B0060' },
  bug:      { primary: '#8BB52A', light: '#F3F9E8', accent: '#4A6A00' },
  rock:     { primary: '#A8956A', light: '#F5F0E8', accent: '#6D5D3A' },
  ghost:    { primary: '#5A4F8C', light: '#ECEAF5', accent: '#2E2660' },
  dragon:   { primary: '#3D52B0', light: '#EAEDFA', accent: '#1A2A7A' },
}

export function getTypeColors(primaryType) {
  return TYPE_COLORS[primaryType] ?? TYPE_COLORS.normal
}
