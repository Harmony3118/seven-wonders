export type GameConfiguration = {
  playerCount: number
  extensions: string[]
}

export type PlayerBagde = {
  playerId: number
  token: string
}

export type CreateGameResponse = {
  gameId: string
  players: PlayerBagde[]
}

export type Identity = PlayerBagde & { gameId: string }
