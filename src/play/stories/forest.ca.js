/**
 * "El bosc de Viridian", in Catalan. The words only — the branching lives in `forest.js`.
 *
 * **Written for the adult who reads it out loud**, which the spec revision made explicit:
 * the child can't read a syllable of this, so the "short simple sentences" rule doesn't
 * apply and would only make the twentieth reading unbearable. Real prose, an aside or a joke
 * per scene, pitched at the parent and performed for the child.
 *
 * Three constraints the prose has to hold, all of them layout constraints in disguise:
 *
 *   1. **One paragraph per line of the array**, because the narration panel sets each as its
 *      own block. That's the teleprompter's chunking — a parent glances down, finds their
 *      place by block, and looks back up.
 *   2. **~330 characters per scene, three blocks.** More than that and the panel either
 *      shrinks the type below arm's-length legibility or scrolls, and a teleprompter that
 *      scrolls mid-sentence is worse than a short story.
 *   3. **A narrated scene ends on the question the choices answer** ("Per on tirem?"), so the
 *      parent hands the tap over out loud instead of the child guessing that it's their turn.
 *
 * The encounter scenes end on a **colon**: the Pokémon's name is rendered next to the art and
 * finishes the sentence, so the reveal is read aloud rather than merely displayed. Which also
 * means both endings have to work for any of the forest's seven residents — nothing here can
 * assume it's a Caterpie.
 *
 * `choices` is keyed by pictogram id, not by scene: an icon means one thing across a whole
 * story, so `branch` gets one label however many scenes offer it. Labels are for the parent,
 * exactly like the Pokémon names in Explore — the picture is the affordance.
 */
export const FOREST_CA = {
  lang: 'ca',
  title: 'El bosc de Viridian',

  narration: {
    edge: [
      'El bosc de Viridian comença aquí mateix, on s’acaba el camí de terra i comencen els arbres que no s’acaben mai.',
      'Fa olor de fulla molla i, de fons, se sent un brunzit fluix i constant, com si algú s’hagués deixat el bosc endollat.',
      'A l’esquerra, un camí ple de sol. A la dreta, un altre que es fa fosc de seguida. Per on tirem?',
    ],

    sunlit: [
      'El camí del sol puja entre falgueres i s’obre en una clariana petita, tota clapejada de llum que es mou sola.',
      'Alguna cosa es belluga en una branca baixa. Potser és una fulla: aquí la meitat de les coses que es mouen són fulles. L’altra meitat, no.',
      'A sobre hi ha branques a l’abast de la mà. A terra, una catifa de fulles seques. Què mirem?',
    ],

    thicket: [
      'Els arbres s’ajunten de seguida, la llum es queda a dalt i, aquí baix, tot es torna d’un verd molt fosc.',
      'Anem a poc a poc i parlant baixet — no perquè faci por, sinó perquè fa respecte, que és una altra cosa i s’aprèn aquí.',
      'El brunzit ara ve de tot arreu: de les branques de sobre i de la fullaraca de sota. On mirem?',
    ],

    canopy: [
      'Sacsegem una branca només una mica, i el bosc contesta de seguida.',
      'Cau a terra, s’espolsa i ens mira, indignat com només se sap indignar qui estava dormint:',
    ],

    litter: [
      'Aixequem un grapat de fulles seques amb molt de compte, com qui obre un regal que es pot escapar.',
      'I a sota, fent-se el distret perquè l’hem enxampat, hi ha:',
    ],
  },

  choices: {
    'sunny-path': 'Cap al sol',
    'dark-path': 'Cap a l’ombra',
    branch: 'Sacseja la branca',
    leaves: 'Mira sota les fulles',
  },
}
