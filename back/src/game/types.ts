import { Carte } from '../../../shared/types'

export type GameConfiguration = {
  playerCount: number
  extensions: string[]
}

export type Player = {
  id: number
  token: string
}

export type GameSession = GameConfiguration & {
  id: string
  players: Player[]
  deck_cartes: { 1: Carte[]; 2: Carte[]; 3: Carte[] }
}

const storageKey = 'seven-wonders-game-session'
