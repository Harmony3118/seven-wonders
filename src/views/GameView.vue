<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { gameSession, hasGameSession } from '@/stores/game'
import CarteView from '../components/CarteAge.vue'

const route = useRoute()
const gameId = computed(() => String(route.params.gameId))
const playerId = computed(() => Number(route.params.playerId))
const isKnownGame = computed(() => hasGameSession(gameId.value))

const nb_carte_tour = 7
const nb_cartes_totale = 7
const i_départ = ((playerId.value + nb_carte_tour) % gameSession.playerCount) * nb_cartes_totale
</script>

<template>
  <div v-if="isKnownGame">
    <p>Partie {{ gameSession.id }}</p>
    <h1>Joueur {{ playerId }}</h1>
    <p>À toi de jouer.</p>
    <p>Joueurs dans la partie : {{ gameSession.players?.join(', ') }}</p>
    <nav aria-label="Pages des joueurs">
      <RouterLink
        v-for="player in gameSession.players"
        :key="player"
        :to="{ name: 'player-game', params: { gameId, playerId: player } }"
        target="_blank"
        rel="noopener"
      >
        Joueur {{ player }}
      </RouterLink>
    </nav>
    <div v-for="age in 3">
      <h2>Carte de l'age {{ age }}</h2>
      <div
        v-for="i in nb_carte_tour"
        :style="{ display: 'grid', flexDirection: 'row', gap: '0.5em' }"
      >
        <CarteView
          v-if="gameSession.deck_cartes"
          :carte="gameSession.deck_cartes[age as 1 | 2 | 3][i_départ + i - 1]"
        />
        <!-- <div v-for="carte in gameSession.deck_cartes[1]" :key="carte.nom">
        <CarteView :carte="carte" /> -->
      </div>
    </div>
  </div>

  <div v-else>
    <h1>Partie introuvable</h1>
    <p>Cette session n'est pas disponible dans ce navigateur.</p>
    <RouterLink :to="{ name: 'new' }">Créer une partie</RouterLink>
  </div>
</template>
