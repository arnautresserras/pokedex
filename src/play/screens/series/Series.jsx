import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAllPokemon } from '../../../hooks/usePokemon'
import { ModeScreen } from '../../components'
import { SceneTransition } from '../../motion'
import { getEpisode, nextEpisode, episodePath } from '../../episodes'
import Encounter from '../story/Encounter'
import SeriesIndex from './SeriesIndex'
import EpisodeScene from './EpisodeScene'
import Continue from './Continue'
import Finish from './Finish'
import EpisodeControls from './EpisodeControls'
import styles from './Series.module.css'

/**
 * Series — "Aventures": the Kanto anime episodes, retold. Story mode's engine reused wherever
 * it still fits (see `EpisodeScene`, `Cast`, and this file's own shape, all deliberately close
 * to `Story.jsx`/`StoryScene.jsx`), but simpler where the content itself is simpler: an episode
 * doesn't branch, so there's no choice graph — just a chain of scenes, each naming the next one
 * it leads to, ending on a scene with none.
 *
 * A scene is still state, not a route, for the exact reason Story's header gives: the *path
 * taken* is what a "back" has to undo, and a deep link into scene four would skip everything
 * that led there.
 */
export default function Series({ mode }) {
  return (
    <Routes>
      <Route index element={<ModeScreen mode={mode}><SeriesIndex /></ModeScreen>} />
      <Route path=":episodeId" element={<EpisodeRoute mode={mode} />} />
      <Route path="*" element={<Navigate to="/play/series" replace />} />
    </Routes>
  )
}

function EpisodeRoute({ mode }) {
  const { episodeId } = useParams()
  const episode = getEpisode(episodeId)

  if (!episode) return <Navigate to="/play/series" replace />

  // Keyed on the episode: switching episodes starts the new one at its own first scene.
  return <EpisodePlayer key={episode.id} mode={mode} episode={episode} />
}

function EpisodePlayer({ mode, episode }) {
  const roster = useAllPokemon()
  const navigate = useNavigate()

  const [{ path, dir }, setState] = useState({ path: [episode.start], dir: 'up' })

  const sceneId = path[path.length - 1]
  // A scene id that isn't in the graph can only come from content, and `verify` fails the build
  // on it — but falling back to the start beats rendering nothing at a child.
  const scene = episode.scenes[sceneId] ?? episode.scenes[episode.start]

  const enter = (nextPath, direction) => setState({ path: nextPath, dir: direction })

  const advance = () => {
    if (scene.next) enter([...path, scene.next], 'forward')
  }
  const restart = () => enter([episode.start], 'up')
  const back = () => {
    if (path.length > 1) enter(path.slice(0, -1), 'back')
  }

  const isEncounter = scene.type === 'encounter'
  const isEnding = scene.type === 'ending'
  const pokemon = isEncounter ? roster.find(p => p.id === scene.pokemonId) : null
  const upcoming = isEnding ? nextEpisode(episode) : null
  const goToNext = () => upcoming && navigate(episodePath(upcoming))
  const goToEpisodes = () => navigate('/play/series')

  return (
    <ModeScreen
      mode={mode}
      controls={
        <EpisodeControls
          onBack={back}
          canBack={path.length > 1}
          onRestart={restart}
          onEpisodes={goToEpisodes}
        />
      }
    >
      <SceneTransition
        sceneKey={`${path.length}:${sceneId}`}
        direction={dir}
        className={styles.stage}
      >
        <EpisodeScene
          scene={scene}
          kind={isEncounter ? 'encounter' : 'narration'}
          protagonist={episode.protagonist}
          cast={scene.cast}
        >
          {isEncounter ? (
            // `pokemon` is null only if a dex id doesn't resolve in the cache, which `verify`
            // fails the build on. If it ever happens at runtime the scene still renders its
            // words and the parent's controls still work, rather than the app going blank.
            pokemon && <Encounter pokemon={pokemon} onAnother={advance} />
          ) : isEnding ? (
            // The ending scene has no `next` scene inside this episode's own graph, so `Continue`
            // doesn't fit here — two differently-shaped, differently-coloured targets instead,
            // one for each way forward: the next episode, or back to pick a different one.
            <Finish hasNext={Boolean(upcoming)} onNext={goToNext} onEpisodes={goToEpisodes} />
          ) : (
            <Continue onTap={advance} />
          )}
        </EpisodeScene>
      </SceneTransition>
    </ModeScreen>
  )
}
