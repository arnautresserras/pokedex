/**
 * "El prat espurnejant", in Catalan. Same authoring rules as `forest.ca.js`, plus two closing
 * scenes — `clearing` and `quiet` — unique to this story: each is the branch's last read-aloud
 * line, landing on a settled statement instead of the "on mirem?" question a scene with more
 * choices ahead would end on.
 */
export const PIKAFIELD_CA = {
  lang: 'ca',
  title: 'El prat espurnejant',

  narration: {
    gate: [
      'Al final del poble, on s’acaba la tanca de fusta, comença un prat sec que brunzeix fluixet, com si tingués corrent per dins.',
      'En Pikachu ensuma l’aire i les galtes li fan una espurna petita, just quan el cel es cobreix d’uns núvols grisos i baixos.',
      'A l’esquerra el prat és tot lluminós. A la dreta, un tram s’amaga sota l’ombra dels fils de la tanca. Per on anem?',
    ],

    openfield: [
      'El prat lluminós és ple d’herba seca que cruix a cada pas, i de tant en tant una espurna diminuta salta d’una tija a una altra.',
      'En Pikachu s’atura, dreça les orelles i mira amunt, cap a un forat clar entremig dels núvols.',
      'Amunt hi ha aquell forat de cel. Avall, l’herba segueix cruixint tota sola. Què mirem?',
    ],

    wireshade: [
      'Sota els fils de la tanca fa una ombra fresca, i un brunzit constant ve de qui sap on, com un rusc molt lluny.',
      'En Pikachu camina arrambat als nostres talons, amb la cua dreta i les orelles ben atentes a cada soroll.',
      'Amunt, els núvols es belluguen. Avall, l’herba seca no para de moure’s. On mirem?',
    ],

    skycrackle: [
      'Un llampec petit esquerda el forat de núvols just un instant, i en Pikachu fa un bot content.',
      'Alguna cosa baixa flotant, o saltant, o volant — encara no ho sabem del cert — i s’atura just davant nostre:',
    ],

    grasshum: [
      'L’herba seca es mou tota sola, com si un corrent hi passés just per sota.',
      'En Pikachu s’hi acosta a poc a poc, i just quan hi arriba, apareix:',
    ],

    clearing: [
      'El forat de núvols s’eixampla de mica en mica, i la pluja que amenaçava es queda en promesa.',
      'En Pikachu s’asseu tranquil al nostre costat, les galtes ja sense espurnes, mirant amunt amb nosaltres.',
      'Tornem cap a la tanca amb el cel més clar, i una tempesta sembla molt més petita quan la mires acompanyat.',
    ],

    quiet: [
      'L’herba deixa de moure’s tota sola, com si també ella s’hagués cansat del joc.',
      'En Pikachu escolta un moment més, i després belluga la cua satisfet, com quan tot acaba com havia d’acabar.',
      'Marxem cap al poble sense enxampar res, amb la idea que aquest prat sempre té alguna cosa més per explicar.',
    ],
  },

  choices: {
    'sunny-path': 'Cap al prat clar',
    'dark-path': 'Cap a l’ombra dels fils',
    'cloud-gap': 'Mira el forat del cel',
    'grass-ripple': 'Mira l’herba que es mou',
  },
}
