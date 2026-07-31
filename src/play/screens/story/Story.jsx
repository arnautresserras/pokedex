import { useRef, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAllPokemon } from '../../../hooks/usePokemon'
import { ModeScreen } from '../../components'
import { SceneTransition } from '../../motion'
import { STORY_LIST, getStory, storyPath } from '../../stories'
import { pickEncounter } from '../../utils/encounters'
import StoryPicker from './StoryPicker'
import StoryScene from './StoryScene'
import SceneChoices from './SceneChoices'
import Encounter from './Encounter'
import ParentControls from './ParentControls'
import styles from './Story.module.css'

/**
 * Story — "Contes": the parent reads, the child chooses, and something lives at the end of it.
 *
 * The mode is an **engine over content**. Nothing in this folder knows what a forest is: the
 * scenes, the words, the pictograms and the encounter's place all come from `src/play/stories/`,
 * which is what makes stories two and three content rather than a slice. That was the plan's
 * decision and it's the one thing worth protecting when this file grows.
 *
 * A story is a route; a scene is state. Explore's levels are routes because a Pokémon card is
 * worth linking to, and Game's round is state because a random round isn't. A scene is the
 * second case for a subtler reason: the *path taken* is what gives a scene its meaning, so a
 * link into scene four would arrive having skipped the choice that led there — and to a parent
 * mid-narration "back" has to mean the previous scene, never the previous URL. Hence the visited
 * path as an array: back pops it, restart empties it, and neither touches history.
 */

/** How many recent encounters are barred from recurring — the pool is only seven deep. */
const RECENT = 3

export default function Story({ mode }) {
  return (
    <Routes>
      {/* A picker with one tile is a screen a child has to cross for no choice, so a single
          story used to skip straight in — now that there are several, the index is the front
          door rather than a detour through the first one. */}
      <Route
        index
        element={
          STORY_LIST.length > 1 ? (
            <ModeScreen mode={mode}>
              <StoryPicker />
            </ModeScreen>
          ) : (
            <Navigate to={storyPath(STORY_LIST[0])} replace />
          )
        }
      />
      <Route path=":storyId" element={<StoryRoute mode={mode} />} />
      <Route path="*" element={<Navigate to="/play/story" replace />} />
    </Routes>
  )
}

/** Resolves the id before any state exists, so a bad one can't leave a half-mounted story. */
function StoryRoute({ mode }) {
  const { storyId } = useParams()
  const story = getStory(storyId)

  if (!story) return <Navigate to="/play/story" replace />

  // Keyed on the story: switching stories has to start the new one at its own beginning rather
  // than inherit a path through the old one's scenes.
  return <StoryPlayer key={story.id} mode={mode} story={story} />
}

function StoryPlayer({ mode, story }) {
  const roster = useAllPokemon()
  const navigate = useNavigate()

  // Recent encounters live in a ref, exactly as Game's do: they're only ever read and written
  // from a tap, so they have no business triggering a render.
  const recentRef = useRef([])

  const [{ path, dir, met }, setState] = useState(() => {
    const start = story.scenes[story.start]
    return {
      path: [story.start],
      dir: 'up',
      met: start?.type === 'encounter' ? pickEncounter(roster, start.pool) : null,
    }
  })

  const sceneId = path[path.length - 1]
  // A scene id that isn't in the graph can only come from content, and `verify` fails the build
  // on it — but falling back to the start beats rendering nothing at a child.
  const scene = story.scenes[sceneId] ?? story.scenes[story.start]

  const meet = target => {
    const pokemon = pickEncounter(roster, target.pool, { recent: recentRef.current })
    if (pokemon) recentRef.current = [...recentRef.current, pokemon.id].slice(-RECENT)
    return pokemon
  }

  /**
   * Every move goes through here — choose, back, restart — so the three pieces of scene state
   * can't drift apart. In particular the encounter's Pokémon is picked *with* the move rather
   * than in an effect afterwards, so the scene never paints for a frame with an empty stage.
   */
  const enter = (nextPath, direction) => {
    const target = story.scenes[nextPath[nextPath.length - 1]]
    setState({
      path: nextPath,
      dir: direction,
      met: target?.type === 'encounter' ? meet(target) : null,
    })
  }

  const choose = choice => enter([...path, choice.next], 'forward')
  const restart = () => enter([story.start], 'up')

  const back = () => {
    if (path.length > 1) enter(path.slice(0, -1), 'back')
  }

  // Meeting another resident of the same place doesn't move the story, so it's the one move
  // that changes `met` alone. Picked outside the updater: the ref mutation must happen once.
  // But an encounter that names a `next` (see forest.js's header vs. route1.js's) isn't the
  // forest's replay loop — it's the doorway to that branch's own closing scene, so the tap
  // advances the path instead of re-rolling the same stage.
  const another = () => {
    if (scene.next) {
      enter([...path, scene.next], 'forward')
      return
    }
    const next = meet(scene)
    setState(current => ({ ...current, met: next }))
  }

  const isEncounter = scene.type === 'encounter'

  return (
    <ModeScreen
      mode={mode}
      controls={
        <ParentControls
          onBack={back}
          canBack={path.length > 1}
          onRestart={restart}
          onStories={STORY_LIST.length > 1 ? () => navigate('/play/story') : null}
        />
      }
    >
      {/* Keyed on depth *and* scene, so walking back into a scene animates as a move too. With
          no sound, this transition is the only confirmation a child gets that their tap did
          something — and the parent's back button borrows it to show which way it went. */}
      <SceneTransition
        sceneKey={`${path.length}:${sceneId}`}
        direction={dir}
        className={styles.stage}
      >
        <StoryScene
          scene={scene}
          kind={isEncounter ? 'encounter' : 'choices'}
          protagonist={story.protagonist}
        >
          {isEncounter ? (
            // `met` is null only if a pool resolved empty, which `verify` fails the build on.
            // If it ever happens at runtime the scene still renders its words and the parent's
            // controls still work, rather than the app going blank.
            met && <Encounter pokemon={met} onAnother={another} />
          ) : (
            <SceneChoices
              choices={scene.choices}
              labels={story.choiceLabels}
              onChoose={choose}
            />
          )}
        </StoryScene>
      </SceneTransition>
    </ModeScreen>
  )
}
