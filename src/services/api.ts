import type { GameConfiguration, GameSession } from '@/stores/game'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  const body: unknown = await response.json()

  if (!response.ok) {
    const message =
      typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string'
        ? body.error
        : 'La requête au serveur a échoué.'
    throw new Error(message)
  }

  return body as T
}

export function createGameRequest(configuration: GameConfiguration) {
  return request<GameSession>('/api/games', {
    method: 'POST',
    body: JSON.stringify(configuration),
  })
}

export function getGameRequest(gameId: string) {
  return request<GameSession>(`/api/games/${encodeURIComponent(gameId)}`)
}

export function chooseCardRequest(
  gameId: string,
  action: { type: 'choose-card'; playerId: number; age: number; cardIndex: number },
) {
  return request<GameSession>(`/api/games/${encodeURIComponent(gameId)}/actions`, {
    method: 'POST',
    body: JSON.stringify(action),
  })
}
