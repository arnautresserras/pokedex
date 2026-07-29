import { GEN_I_TYPES, pokemonTypes, getPlayTypeColors } from './utils/playColors'

/**
 * The 15 type rooms, as data — the sibling of `modes.js`, one level down.
 *
 * Explore's navigation model is "pick a colour, then pick a face". That makes a room's
 * identity — its colour, its Catalan name, its pictogram and its members — the thing that has
 * to live in exactly one place, the same way a mode's does. The index screen, the grid screen
 * and the card all read from here.
 *
 * Rooms are the 15 Gen I types and only those: `playColors.js` drops `fairy` and `steel`
 * rather than colouring them, so there is no sixteenth room and no Pokémon that belongs to
 * nowhere. A dual-type Pokémon appears in both of its rooms, which is a feature — finding
 * Charizard in Foc *and* in Volador is how a child learns it's both.
 *
 * `face` is the room's representative silhouette: the most recognisable member, hand-picked
 * rather than "first by id", which would put Pidgey on the flying room and Weedle on poison.
 * It's a watermark behind the pictogram, never the subject — the tile has to say "a room full
 * of these", not "this one Pokémon".
 */

/** Catalan labels. Ordered as `TYPE_COLORS` is, so the index reads in Pokédex chart order. */
const ROOMS = {
  normal:   { label: 'Normal',   face: 143 }, // Snorlax
  fire:     { label: 'Foc',      face: 6 },   // Charizard
  water:    { label: 'Aigua',    face: 9 },   // Blastoise
  grass:    { label: 'Planta',   face: 3 },   // Venusaur
  electric: { label: 'Elèctric', face: 25 },  // Pikachu
  ice:      { label: 'Gel',      face: 144 }, // Articuno
  fighting: { label: 'Lluita',   face: 68 },  // Machamp
  poison:   { label: 'Verí',     face: 24 },  // Arbok
  ground:   { label: 'Terra',    face: 51 },  // Dugtrio
  flying:   { label: 'Volador',  face: 18 },  // Pidgeot
  psychic:  { label: 'Psíquic',  face: 65 },  // Alakazam
  bug:      { label: 'Insecte',  face: 12 },  // Butterfree
  rock:     { label: 'Roca',     face: 95 },  // Onix
  ghost:    { label: 'Fantasma', face: 94 },  // Gengar
  dragon:   { label: 'Drac',     face: 149 }, // Dragonite
}

export const TYPE_ROOMS = GEN_I_TYPES.map(type => ({ type, ...ROOMS[type] }))

const BY_TYPE = new Map(TYPE_ROOMS.map(room => [room.type, room]))

export function getTypeRoom(type) {
  return BY_TYPE.get(type)
}

/** A room's route. Type is its path segment, the same one-source rule `modePath` follows. */
export function roomPath(type) {
  return `/play/explore/${type}`
}

/** A Pokémon's route *within* a room — the room is where you came from, and where back goes. */
export function cardPath(type, id) {
  return `/play/explore/${type}/${id}`
}

/**
 * type → members, built once. The roster is the committed cache, so its identity is stable
 * for the life of the app and a single-entry memo is all the caching this needs; passing the
 * roster in (rather than importing the JSON here) keeps the documented
 * cache → `usePokemon` → component data flow intact.
 */
let memoRoster = null
let memoIndex = null

export function membersByType(roster) {
  if (roster === memoRoster) return memoIndex

  const index = new Map(GEN_I_TYPES.map(type => [type, []]))
  for (const pokemon of roster) {
    for (const type of pokemonTypes(pokemon)) index.get(type)?.push(pokemon)
  }
  // Dex order inside a room: it's the order the child will see everywhere else, and it keeps
  // evolution families adjacent so a room reads as families rather than as 33 strangers.
  for (const members of index.values()) members.sort((a, b) => a.id - b.id)

  memoRoster = roster
  memoIndex = index
  return index
}

export function roomMembers(roster, type) {
  return membersByType(roster).get(type) ?? []
}

/** The rooms with their populations attached — what the index screen renders. */
export function roomsWithMembers(roster) {
  const index = membersByType(roster)
  return TYPE_ROOMS.map(room => ({
    ...room,
    members: index.get(room.type) ?? [],
    colors: getPlayTypeColors(room.type),
  }))
}
