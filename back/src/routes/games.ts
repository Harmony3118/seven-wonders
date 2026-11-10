import { Router } from 'express'
import { GameConfiguration } from '../game/types'
import { createGame } from '../game/createGame'
import { games } from '../store'

const router = Router()

const MIN_PLAYERS = 3
const MAX_PLAYERS = 7

// Vérification des données du front
function parseConfiguration(body: unknown): GameConfiguration | null {
  if (typeof body !== 'object' || body === null) return null
  const { playerCount, extensions } = body as Record<string, unknown>

  if (
    typeof playerCount !== 'number' ||
    !Number.isInteger(playerCount) ||
    playerCount < MIN_PLAYERS ||
    playerCount > MAX_PLAYERS
  ) {
    return null
  }

  if (!Array.isArray(extensions) || !extensions.every((e) => typeof e === 'string')) {
    return null
  }

  return { playerCount, extensions }
}

// POST /games
router.post('/', (requete, response) => {
  const config = parseConfiguration(requete.body)
  if (!config) {
    response.status(400).json({ error: 'Configuration invalide' })
    return
  }

  const game = createGame(config)
  games.set(game.id, game) // enregistrer les parties

  const creator = game.players[0]

  response.status(201).json({
    gameId: game.id,
    players: game.players.map((p) => ({ playerId: p.id, token: p.token })),
  })
})

export default router
