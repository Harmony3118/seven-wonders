<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Slider from 'primevue/slider'
import { useGameStore } from '@/stores/game'
import type { CreateGameResponse, GameConfiguration } from '@/types'

const router = useRouter()
const gameStore = useGameStore()

const nbJoueurs = ref(3)
const selectedExtention = ref(['Base'])

const created = ref<CreateGameResponse | null>(null)

const links = computed(
  () =>
    created.value?.players.map((p) => ({
      playerId: p.playerId,
      token: p.token,
      url: `${window.location.origin}/game/${created.value!.gameId}/${p.playerId}/${p.token}`,
    })) ?? [],
)

async function startGame() {
  try {
    created.value = await gameStore.createGame({
      playerCount: nbJoueurs.value,
      extensions: selectedExtention.value,
    })
    // router.push({ name: 'player-game', params: { gameId: gameId, playerId: 1 } })
    // router.push({ name: 'game', params: { id: gameId } })
  } catch {
    // gestion d'erreur dans gameStore
  }
}

function goToGame() {
  router.push({ name: 'game', params: { id: created.value!.gameId } })
}

async function copy(url: string) {
  await navigator.clipboard.writeText(url)
}
</script>

<template>
  <form v-if="!created" @submit.prevent="startGame" class="about grid">
    <p>Nombre de joueurs : {{ nbJoueurs }}{{ nbJoueurs == 2 ? ' + 1 virtuel' : '' }}</p>
    <Slider v-model="nbJoueurs" :step="1" :min="2" :max="7" />
    <h2>Extension</h2>
    <div :style="{ display: 'flex', flexDirection: 'column', gap: '0.5em' }">
      <div>
        <input
          type="checkbox"
          id="base"
          value="Base"
          v-model="selectedExtention"
          defaultValue="Base"
          disabled
        />
        <label for="armada" :style="{ color: 'gray' }"> Base</label>
      </div>
      <div>
        <input type="checkbox" id="armada" value="Armada" v-model="selectedExtention" />
        <label for="armada"> Armada</label>
      </div>
      <div>
        <input type="checkbox" id="cities" value="Cities" v-model="selectedExtention" />
        <label for="cities"> Cities</label>
      </div>
      <div>
        <input type="checkbox" id="leaders" value="Leaders" v-model="selectedExtention" />
        <label for="leaders"> Leaders</label>
      </div>
    </div>
    <p>Extensions sélectionnées : {{ selectedExtention.join(', ') }}</p>

    <button type="submit" :disabled="gameStore.loading" @click="startGame()">
      {{ gameStore.loading ? 'Création...' : 'Démarrer la partie' }}
    </button>

    <p v-if="gameStore.error" class="error">{{ gameStore.error }}</p>
  </form>

  <section v-else>
    <h2>Partie créée !</h2>
    <nav aria-label="Pages des joueurs">
      <div v-for="link in links" :key="link.playerId">
        <RouterLink
          :to="{
            name: 'player-game',
            params: { gameId: created.gameId, playerId: link.playerId, token: link.token },
          }"
          target="_blank"
          rel="noopener"
        >
          <!-- :to="{ name: 'game', params: { id: created.gameId } }" -->
          Joueur {{ link.playerId }}
        </RouterLink>
        <button @click="copy(link.url)">Copier le lien</button>
      </div>
    </nav>
  </section>
</template>
