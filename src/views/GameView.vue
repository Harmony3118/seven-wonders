<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { chooseCard, gameSession, hasGameSession, loadGame } from '@/stores/game'
import CarteView from '../components/CarteAge.vue'

const route = useRoute()
const gameId = computed(() => String(route.params.gameId))
const playerId = computed(() => Number(route.params.playerId))
const isKnownGame = computed(() => hasGameSession(gameId.value))
const isLoading = ref(true)
const errorMessage = ref('')
const isSendingAction = ref(false)

const nb_carte_tour = 7
const nb_cartes_totale = 7
const i_départ = computed(
  () => ((playerId.value + nb_carte_tour) % (gameSession.playerCount ?? 1)) * nb_cartes_totale,
)

async function refreshGame() {
  isLoading.value = true
  try {
    await loadGame(gameId.value)
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Impossible de charger la partie.'
  } finally {
    isLoading.value = false
  }
}

function hasPlayerChosen(age: number) {
  return (
    gameSession.choices?.some(
      (choice) => choice.playerId === playerId.value && choice.age === age,
    ) ?? false
  )
}

async function selectCard(age: 1 | 2 | 3, cardIndex: number) {
  isSendingAction.value = true
  errorMessage.value = ''

  try {
    await chooseCard(gameId.value, {
      type: 'choose-card',
      playerId: playerId.value,
      age,
      cardIndex,
    })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Action refusée.'
  } finally {
    isSendingAction.value = false
  }
}

onMounted(refreshGame)
watch(gameId, refreshGame)
</script>

<template>
  <div v-if="isLoading">
    <p>Chargement de la partie...</p>
  </div>

  <div v-else-if="isKnownGame">
    <p>Partie {{ gameSession.id }}</p>
    <h1>Joueur {{ playerId }}</h1>
    <p>À toi de jouer.</p>
    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
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
        <button
          v-if="gameSession.deck_cartes?.[age as 1 | 2 | 3]?.[i_départ + i - 1]"
          type="button"
          :disabled="isSendingAction || hasPlayerChosen(age)"
          @click="selectCard(age as 1 | 2 | 3, i_départ + i - 1)"
        >
          <CarteView :carte="gameSession.deck_cartes[age as 1 | 2 | 3][i_départ + i - 1]" />
        </button>
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
