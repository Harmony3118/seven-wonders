<script setup lang="ts">
import type { Carte } from '../types'

defineProps<{ carte: Carte }>()
</script>

<template>
  <div class="carte" :style="{ backgroundColor: carte.couleur }">
    {{ carte.nom }}
  </div>
</template>

<style scoped>
.carte {
  padding: 1rem;
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  color: white;
  width: 10rem;
  text-align: center;
}
</style>
