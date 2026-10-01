<script setup lang="ts">
import CarteView from '../components/CarteAge.vue'
// import { catalogue_cartes } from '../data/cartes'
import { creerCartes } from '../data/cartes'

const autre = creerCartes(4)

</script>

<template>
  <main>
    <h1>Seven Wonders</h1>
    <p>Construisez votre merveille et développez votre civilisation.</p>
    <div v-for="carte in autre" :key="carte.nom" class="grid grid-cols-4">
      <!-- <h2>{{ carte.nom }}</h2> -->
      <CarteView :carte="carte" />
    </div>
    <RouterLink to="/new">Nouvelle partie</RouterLink>
  </main>
</template>
