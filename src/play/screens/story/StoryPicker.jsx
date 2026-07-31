import { useNavigate } from 'react-router-dom'
import { Tappable } from '../../motion'
import { protagonistBackUrl } from '../../peopleSprites'
import { backSpriteUrl } from '../../utils/playAssets'
import { STORY_LIST, storyPath } from '../../stories'
import Backdrop from './Backdrop'
import styles from './StoryPicker.module.css'

/**
 * "Contes"'s front door — one tile per story, chosen the same way Explore's rooms are: a
 * picture of the place, not a title to read. Each tile is the story's own opening backdrop
 * with its protagonist standing on it, which is exactly what the first scene looks like, so
 * picking a story is picking a place rather than picking an unfamiliar word.
 *
 * Only exists because there are now enough stories to pick between — `Story.jsx`'s index route
 * used to skip straight to the forest for exactly the reason a picker with one tile would be a
 * screen a child has to cross for no choice. The title under each tile is for the parent, same
 * contract every other tile in the app makes.
 *
 * Doesn't reuse `Protagonist` for the sprite: that component's own class sets a fixed height
 * meant for the scene layout, and overriding it from here would be the "two rules fighting over
 * width" coin flip the type-glyph sizing contract warns about. A plain `img` sized by this
 * tile's own CSS sidesteps it.
 */
export default function StoryPicker() {
  const navigate = useNavigate()

  return (
    <div className={styles.picker}>
      <div className={styles.tiles}>
        {STORY_LIST.map(story => {
          const start = story.scenes[story.start]
          const protagonistSrc =
            typeof story.protagonist === 'object' && story.protagonist !== null
              ? backSpriteUrl(story.protagonist.pokemon)
              : protagonistBackUrl(story.protagonist)

          return (
            <Tappable
              key={story.id}
              className={styles.tile}
              pressScale={0.975}
              onTap={() => navigate(storyPath(story))}
              aria-label={story.title}
            >
              <div className={styles.preview}>
                <Backdrop id={start?.backdrop} />
                {protagonistSrc && (
                  <img
                    className={styles.protagonist}
                    src={protagonistSrc}
                    alt=""
                    draggable="false"
                    aria-hidden="true"
                  />
                )}
              </div>
              <span className={styles.label}>{story.title}</span>
            </Tappable>
          )
        })}
      </div>
    </div>
  )
}
