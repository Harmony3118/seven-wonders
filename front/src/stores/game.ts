import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as gameApi from '@/services/gameApi'
import { loadIdentity, saveIdentity } from '@/services/identityStorage'
import type { CreateGameResponse, GameConfiguration, Identity } from '@/types'

export const useGameStore = defineStore('game', () => {
  // Etat
  const identity = ref<Identity | null>(loadIdentity())
  const loading = ref(false)
  const error = ref<string | null>(null)

  function setIdentity(value: Identity) {
    identity.value = value
    saveIdentity(value)
  }

  async function createGame(config: GameConfiguration): Promise<CreateGameResponse> {
    loading.value = true
    error.value = null

    try {
      const created = await gameApi.createGame(config)
      const me = created.players[0]
      setIdentity({ gameId: created.gameId, playerId: me.playerId, token: me.token })
      return created
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue'
      throw e
    } finally {
      loading.value = false
    }
  }

  function isCurrentGame(gameId: string): boolean {
    return identity.value?.gameId === gameId
  }

  return { identity, loading, error, createGame, setIdentity, isCurrentGame }
})
