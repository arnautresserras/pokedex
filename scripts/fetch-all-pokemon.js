#!/usr/bin/env node
// One-time script: populates src/data/pokemon-cache.json with all 151 Gen I Pokémon.
// Run: node scripts/fetch-all-pokemon.js

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const BASE = 'https://pokeapi.co/api/v2'
const __dirname = dirname(fileURLToPath(import.meta.url))

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.json()
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

function capitalize(str) {
  return str.split(/[\s-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const GROWTH_RATE_NAMES = {
  'slow': 'Slow', 'medium': 'Medium', 'fast': 'Fast',
  'medium-slow': 'Medium Slow', 'slow-then-very-fast': 'Erratic',
  'fast-then-very-slow': 'Fluctuating',
}

const VERSION_DISPLAY = {
  red: 'Red', blue: 'Blue', yellow: 'Yellow',
  gold: 'Gold', silver: 'Silver', crystal: 'Crystal',
  firered: 'FireRed', leafgreen: 'LeafGreen',
}

const GEN1_VERSION_GROUPS = new Set(['red-blue', 'yellow'])

function parseFlavorTexts(entries) {
  const PRIORITY = ['red', 'blue', 'yellow', 'gold', 'silver', 'crystal', 'firered', 'leafgreen']
  const seen = new Set()
  const result = []
  for (const version of PRIORITY) {
    const entry = entries.find(e => e.language.name === 'en' && e.version.name === version)
    if (!entry) continue
    const text = entry.flavor_text.replace(/[\f\n]/g, ' ').replace(/\s+/g, ' ').trim()
    if (!seen.has(text)) {
      seen.add(text)
      result.push({ text, version: VERSION_DISPLAY[version] ?? version })
    }
    if (result.length >= 4) break
  }
  return result
}

function getTrigger(details) {
  if (!details) return null
  const name = details.trigger?.name
  if (name === 'level-up') {
    if (details.min_level) return `Lv ${details.min_level}`
    if (details.min_happiness) return 'Friendship'
    return 'Level up'
  }
  if (name === 'use-item') return capitalize((details.item?.name ?? 'item').replace(/-/g, ' '))
  if (name === 'trade') return 'Trade'
  return capitalize((name ?? '').replace(/-/g, ' '))
}

// Extend a node all the way to the end of its first branch (for linear tails).
function extendToLeaf(node) {
  const id = parseInt(node.species.url.split('/').at(-2))
  const trigger = node.evolution_details?.length > 0 ? getTrigger(node.evolution_details[0]) : null
  const entry = { id, name: capitalize(node.species.name), trigger }
  if (node.evolves_to.length === 0) return [entry]
  return [entry, ...extendToLeaf(node.evolves_to[0])]
}

// Find the branch that contains targetId and return it in full (root → leaf).
function findBranchContaining(node, targetId) {
  const id = parseInt(node.species.url.split('/').at(-2))
  const trigger = node.evolution_details?.length > 0 ? getTrigger(node.evolution_details[0]) : null
  const entry = { id, name: capitalize(node.species.name), trigger }

  if (id === targetId) {
    // Continue to the end of this branch so early-chain members get the full chain.
    if (node.evolves_to.length === 0) return [entry]
    return [entry, ...extendToLeaf(node.evolves_to[0])]
  }

  for (const child of node.evolves_to) {
    const found = findBranchContaining(child, targetId)
    if (found) return [entry, ...found]
  }
  return null
}

async function main() {
  const evoCache = {}
  const moveCache = {}
  const all = []

  console.log('Fetching all 151 Gen I Pokémon from PokéAPI...\n')

  for (let id = 1; id <= 151; id++) {
    process.stdout.write(`[${String(id).padStart(3, '0')}/151] `)

    const [poke, species] = await Promise.all([
      fetchJSON(`${BASE}/pokemon/${id}`),
      fetchJSON(`${BASE}/pokemon-species/${id}`),
    ])
    await sleep(250)

    // Evolution chain (cached — multiple Pokémon share the same chain URL)
    const evoUrl = species.evolution_chain.url
    if (!evoCache[evoUrl]) {
      evoCache[evoUrl] = await fetchJSON(evoUrl)
      await sleep(200)
    }
    const evolutionChain = findBranchContaining(evoCache[evoUrl].chain, id) ?? []

    // Gen I level-up moves — pick the highest-level 5 (signature / powerful moves)
    const gen1LevelUpMoves = poke.moves
      .flatMap(m =>
        m.version_group_details
          .filter(d => GEN1_VERSION_GROUPS.has(d.version_group.name) && d.move_learn_method.name === 'level-up')
          .map(d => ({ url: m.move.url, level: d.level_learned_at }))
      )
      .reduce((acc, m) => {
        // keep highest level seen per move URL (de-dup across red-blue / yellow)
        if (!acc[m.url] || acc[m.url].level < m.level) acc[m.url] = m
        return acc
      }, {})

    const topMoves = Object.values(gen1LevelUpMoves)
      .sort((a, b) => a.level - b.level)
      .slice(-5) // last 5 by level = most powerful

    const moves = []
    for (const { url, level } of topMoves) {
      if (!moveCache[url]) {
        moveCache[url] = await fetchJSON(url)
        await sleep(150)
      }
      const m = moveCache[url]
      moves.push({
        name: capitalize(m.name.replace(/-/g, ' ')),
        type: m.type.name,
        power: m.power ?? null,
        learnAt: level === 0 ? 'Start' : `Lv ${level}`,
      })
    }

    const abilityEntry = poke.abilities.find(a => !a.is_hidden) ?? poke.abilities[0]
    const ability = capitalize((abilityEntry?.ability.name ?? 'unknown').replace(/-/g, ' '))
    const category = species.genera.find(g => g.language.name === 'en')?.genus ?? 'Unknown Pokémon'

    all.push({
      id: poke.id,
      name: capitalize(poke.name),
      types: poke.types.sort((a, b) => a.slot - b.slot).map(t => t.type.name),
      category,
      height: poke.height,
      weight: poke.weight,
      ability,
      flavorTexts: parseFlavorTexts(species.flavor_text_entries),
      captureRate: species.capture_rate,
      baseExperience: poke.base_experience,
      growthRate: GROWTH_RATE_NAMES[species.growth_rate?.name] ?? capitalize(species.growth_rate?.name ?? ''),
      eggGroups: species.egg_groups.map(eg => capitalize(eg.name.replace(/-/g, ' '))),
      genderRate: species.gender_rate,
      stats: poke.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
      sprites: {
        frontDefault: poke.sprites.front_default,
        officialArtwork: poke.sprites.other?.['official-artwork']?.front_default ?? null,
      },
      evolutionChain,
      locations: [],
      moves,
    })

    console.log(`✓ ${capitalize(poke.name)}`)
    await sleep(200)
  }

  const outPath = resolve(__dirname, '../src/data/pokemon-cache.json')
  writeFileSync(outPath, JSON.stringify(all, null, 2))
  console.log(`\nDone — wrote ${all.length} Pokémon to ${outPath}`)
}

main().catch(err => {
  console.error('\nFetch failed:', err.message)
  process.exit(1)
})
