import { FOREST } from './forest.js'
import { FOREST_CA } from './forest.ca.js'

/**
 * The stories, as data — `modes.js` and `typeRooms.js`'s sibling, one mode down.
 *
 * Slice 5 ships one polished story plus an engine, and the whole point of that split is that
 * story two and three are *content*: a graph file, a text file, two lines here, and no
 * component touched. Which only stays true if the engine never learns anything about the
 * forest — so nothing below is forest-specific.
 *
 * **Imports here carry explicit `.js` extensions**, unlike the rest of `src/play/`, because
 * `scripts/verify-play.js` imports this module under plain Node to walk the scene graph. Slice
 * 4's round invariants never got a verify check for exactly this reason; story content is the
 * opposite case — it's authored prose that a typo can break silently, so it's worth keeping
 * the module Node-importable. That means data only in this folder: no JSX, no
 * `import.meta.env`, no extensionless imports.
 */

/**
 * Joins a graph to a language's words. A scene keeps its shape and gains `narration`; the
 * story gains its title and the choice labels.
 *
 * A missing text key leaves `narration` empty rather than throwing, because `verify` reports
 * every empty scene at once — which is more useful while authoring than the first one loudly.
 */
export function withText(graph, text) {
  return {
    ...graph,
    lang: text.lang,
    title: text.title,
    choiceLabels: text.choices ?? {},
    scenes: Object.fromEntries(
      Object.entries(graph.scenes).map(([id, scene]) => [
        id,
        { ...scene, narration: text.narration?.[id] ?? [] },
      ]),
    ),
  }
}

export const STORIES = {
  forest: withText(FOREST, FOREST_CA),
}

/** Authoring order — what a picker screen would render once there's a second story. */
export const STORY_LIST = Object.values(STORIES)

export function getStory(id) {
  return STORIES[id] ?? null
}

/** A story's route. Its id is its path segment, the same rule `modePath` and `roomPath` follow. */
export function storyPath(story) {
  return `/play/story/${story.id}`
}
