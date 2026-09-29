import { reactive } from 'vue'

export type GameConfiguration = {
  playerCount: number
  extensions: string[]
}

export type GameSession = GameConfiguration & {
  id: string
  players: number[]
}

const storageKey = 'seven-wonders-game-session'

function readStoredSession(): Partial<GameSession> {
  if (typeof localStorage === 'undefined') return {}

  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return {}

    const session: unknown = JSON.parse(stored)
    if (
      typeof session === 'object' &&
      session !== null &&
      'id' in session &&
      typeof session.id === 'string' &&
      'playerCount' in session &&
      typeof session.playerCount === 'number' &&
      'extensions' in session &&
      Array.isArray(session.extensions) &&
      'players' in session &&
      Array.isArray(session.players)
    ) {
      return session as GameSession
    }
  } catch {
    localStorage.removeItem(storageKey)
  }

  return {}
}

export const gameSession = reactive<Partial<GameSession>>(readStoredSession())

export function createGame(configuration: GameConfiguration): GameSession {
  const session: GameSession = {
    id: crypto.randomUUID(),
    playerCount: configuration.playerCount,
    extensions: [...configuration.extensions],
    players: Array.from({ length: configuration.playerCount }, (_, index) => index + 1),
  }

  Object.assign(gameSession, session)
  localStorage.setItem(storageKey, JSON.stringify(session))
  return session
}

export function hasGameSession(gameId: string): boolean {
  return gameSession.id === gameId
}
