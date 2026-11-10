import type { GameSession } from './game/types'

export const games = new Map<string, GameSession>()

console.log(games.size)