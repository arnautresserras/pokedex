/**
 * Formats a flat tile-ID array as the CSV body of a `.tmx` `<data>` block, one row per map
 * row for readability. No trailing comma after the final value — real Tiled-exported files
 * never have one, and a stray extra field there is exactly what made Tiled reject a
 * hand-generated map as corrupt (an extra empty 601st field on a 30x20/600-cell layer).
 */
export function tmxCsv(flatArray, width) {
  const rows = []
  for (let r = 0; r * width < flatArray.length; r++) {
    rows.push(flatArray.slice(r * width, (r + 1) * width).join(','))
  }
  return rows.join(',\n')
}
