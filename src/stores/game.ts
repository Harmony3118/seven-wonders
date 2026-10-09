import { reactive } from 'vue'
import { Carte } from '../types'
import { chooseCardRequest, createGameRequest, getGameRequest } from '@/services/api'

export type GameConfiguration = {
  playerCount: number
  extensions: string[]
}

export type GameSession = GameConfiguration & {
  id: string
  players: number[]
  deck_cartes: { 1: Carte[]; 2: Carte[]; 3: Carte[] }
  choices: { playerId: number; age: number; cardIndex: number }[]
}

export const gameSession = reactive<Partial<GameSession>>({})

function updateGameSession(session: GameSession) {
  Object.assign(gameSession, session)
}

export async function createGame(configuration: GameConfiguration): Promise<GameSession> {
  const session = await createGameRequest(configuration)
  updateGameSession(session)
  return session
}

export async function loadGame(gameId: string): Promise<GameSession> {
  const session = await getGameRequest(gameId)
  updateGameSession(session)
  return session
}

export async function chooseCard(
  gameId: string,
  action: { type: 'choose-card'; playerId: number; age: number; cardIndex: number },
): Promise<GameSession> {
  const session = await chooseCardRequest(gameId, action)
  updateGameSession(session)
  return session
}

export function hasGameSession(gameId: string): boolean {
  return gameSession.id === gameId
}
