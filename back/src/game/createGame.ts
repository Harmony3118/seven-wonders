import { creerCartes } from './cartes'
import { GameConfiguration, GameSession } from './types'

export function createGame(config: GameConfiguration): GameSession {
  return {
    id: crypto.randomUUID(),
    playerCount: config.playerCount,
    extensions: [...config.extensions],
    players: Array.from({ length: config.playerCount }, (_, index) => ({
      id: index + 1,
      token: crypto.randomUUID(),
    })),
    deck_cartes: creerCartes(config.playerCount),
  }
}
