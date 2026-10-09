<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Slider from 'primevue/slider'
import { createGame } from '@/stores/game'

const nbJoueurs = ref(3)

const selectedExtention = ref(['Base'])
const router = useRouter()

const startGame = async () => {
  const game = createGame({
    playerCount: nbJoueurs.value,
    extensions: selectedExtention.value,
  })

  await router.push({
    name: 'player-game',
    params: { gameId: game.id, playerId: '1' },
  })
}
</script>

<template>
  <div class="about grid">
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
    <span>Extensions sélectionnées : {{ selectedExtention.join(', ') }}</span>
    <button @click="startGame">Démarrer la partie</button>
  </div>
</template>
