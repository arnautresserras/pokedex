/**
 * "El camí de Pallet", in Catalan. Same authoring rules as `forest.ca.js`, plus two closing
 * scenes — `nest` and `friend` — that only this story has: each is the last thing read out
 * loud for its branch, so each ends on a settled statement rather than the "on mirem?" question
 * a scene with more choices ahead would end on.
 */
export const ROUTE1_CA = {
  lang: 'ca',
  title: 'El camí de Pallet',

  narration: {
    road: [
      'El poble de Pallet encara dorm quan sortim, i l’herba del camí és tota coberta de rosada freda.',
      'Davant la tanca de fusta el camí es parteix en dos: un tram inundat de sol i un altre que s’enfonsa a l’ombra d’una bardissa espessa.',
      'Les sabates noves ja fan pols a cada pas. Per quin camí anem?',
    ],

    meadow: [
      'El camí del sol travessa un prat ample, amb l’herba tan alta que es belluga tota alhora quan passa una ratxa de vent.',
      'Se sent un cruixit lleuger, com si algú caminés de puntetes just al costat, amagat entre les tiges.',
      'Dalt, la bardissa és plena de nius. Baix, l’herba amaga qui sap què. Què mirem?',
    ],

    hedgerow: [
      'La bardissa fa una ombra fresca i espessa, i el brunzit d’un insecte va i ve com si no sabés si sortir o no.',
      'Anem a poc a poc, vigilant on posem els peus, que entre la fullaraca es pot amagar qualsevol cosa.',
      'Dalt, les branques es toquen quasi bé. Baix, les fulles seques cruixen a cada pas. On mirem?',
    ],

    hedgetop: [
      'Sacsegem la bardissa només un pols, i tota la planta trontolla de dalt a baix.',
      'Cau entremig de les fulles, s’espolsa la pols i ens mira com si l’haguéssim despertat d’una migdiada:',
    ],

    grassnest: [
      'Apartem l’herba alta amb molta cura, com qui no vol espantar ningú.',
      'I allà baix, arraulit entre les tiges, fent veure que no l’hem vist, hi ha:',
    ],

    nest: [
      'Ho deixem tot exactament com estava, i la bardissa es torna a tancar com una cortina de fulles.',
      'Ens mira un instant més, com si volgués dir-nos que ja n’hi ha prou de festa per avui.',
      'El camí de Pallet continua, i avui hem après que és més bonic visitar algú que no pas treure’l de casa.',
    ],

    friend: [
      'Camina uns quants passos amb nosaltres, com si el camí també fos, ara, una mica seu.',
      'No l’hem enxampat, i no cal fer-ho: per avui, n’hi ha prou amb una mica de companyia inesperada.',
      'Seguim cap a la Ruta 22, i el poble de Pallet, darrere nostre, ja és només un record petit i lluminós.',
    ],
  },

  choices: {
    'sunny-path': 'Cap al sol',
    'dark-path': 'Cap a la bardissa',
    branch: 'Sacseja la bardissa',
    leaves: 'Mira sota l’herba',
  },
}
