import type { CreateGameResponse, GameConfiguration } from '@/types'

const BASE = import.meta.env.VITE_API_URL

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? `Erreur serveur (${res.status})`)
  }
  return res.json()
}

export function createGame(config: GameConfiguration) {
  return request<CreateGameResponse>('/games', {
    method: 'POST',
    body: JSON.stringify(config),
  })
}
