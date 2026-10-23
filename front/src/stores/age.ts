import { reactive } from 'vue'
import { Carte } from '../types'
import { compile } from '@vue/compiler-dom'

type ConfigurationAge = {
  nb_joueur: number
  paquet: Carte[]
  nb_cartes_totale: number
}

function selectionCarte(playerId: number): boolean {
  return true
}

export function jouerAge(conf: ConfigurationAge) {
  let nb_carte_restante = conf.nb_cartes_totale
  while (nb_carte_restante > 1) {
    // Chaque joueur choisi sa carte
    for (let j = 0; j < conf.nb_joueur; j++) {
      selectionCarte(j)
    }
    nb_carte_restante -= 1
  }
  // const i_départ = ((playerId.value + nb_carte_tour) % gameSession.playerCount) * nb_cartes_totale
}
