import { EP001 } from './ep001.js'
import { EP001_CA } from './ep001.ca.js'
import { EP002 } from './ep002.js'
import { EP002_CA } from './ep002.ca.js'
import { EP003 } from './ep003.js'
import { EP003_CA } from './ep003.ca.js'
import { EP004 } from './ep004.js'
import { EP004_CA } from './ep004.ca.js'
import { EP005 } from './ep005.js'
import { EP005_CA } from './ep005.ca.js'
import { EP006 } from './ep006.js'
import { EP006_CA } from './ep006.ca.js'
import { EP007 } from './ep007.js'
import { EP007_CA } from './ep007.ca.js'
import { EP008 } from './ep008.js'
import { EP008_CA } from './ep008.ca.js'
import { EP009 } from './ep009.js'
import { EP009_CA } from './ep009.ca.js'
import { EP010 } from './ep010.js'
import { EP010_CA } from './ep010.ca.js'

/**
 * Joins an episode graph (scenes, backdrops, cast, encounters — the shape) with its prose
 * (narration text, keyed by scene id — the words). Same split and same join shape as
 * src/play/stories/index.js, minus choiceLabels: episodes are linear (no choices).
 */
export function withText(graph, text) {
  return {
    ...graph,
    lang: text.lang,
    title: text.title,
    scenes: Object.fromEntries(
      Object.entries(graph.scenes).map(([id, scene]) => [
        id,
        { ...scene, narration: text.narration?.[id] ?? [] },
      ]),
    ),
  }
}

export const EPISODES = {
  ep001: withText(EP001, EP001_CA),
  ep002: withText(EP002, EP002_CA),
  ep003: withText(EP003, EP003_CA),
  ep004: withText(EP004, EP004_CA),
  ep005: withText(EP005, EP005_CA),
  ep006: withText(EP006, EP006_CA),
  ep007: withText(EP007, EP007_CA),
  ep008: withText(EP008, EP008_CA),
  ep009: withText(EP009, EP009_CA),
  ep010: withText(EP010, EP010_CA),
}

export const EPISODE_LIST = Object.values(EPISODES).sort((a, b) => a.code.localeCompare(b.code))

export function getEpisode(id) {
  return EPISODES[id] ?? null
}

export function episodePath(episode) {
  return `/play/series/${episode.id}`
}

/** The next episode in canon order, or `null` past the last one. */
export function nextEpisode(episode) {
  const i = EPISODE_LIST.findIndex(e => e.id === episode.id)
  return i === -1 ? null : EPISODE_LIST[i + 1] ?? null
}
