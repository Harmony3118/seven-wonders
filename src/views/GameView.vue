<!-- <script setup></script>

<template>
  <div>
    <h1>Page de jeu en cours de construction 🚧</h1>
  </div>
</template> -->


<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { gameSession, hasGameSession } from '@/stores/game'

const route = useRoute()
const gameId = computed(() => String(route.params.gameId))
const playerId = computed(() => String(route.params.playerId))
const isKnownGame = computed(() => hasGameSession(gameId.value))
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
  </div>
  <div v-else>
    <h1>Partie introuvable</h1>
    <p>Cette session n'est pas disponible dans ce navigateur.</p>
    <RouterLink :to="{ name: 'new' }">Créer une partie</RouterLink>
  </div>
</template>
