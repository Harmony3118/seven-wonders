import { randomUUID } from 'node:crypto'
import express from 'express'
import { creerCartes } from '../src/data/cartes'
import type { Carte } from '../src/types'

type GameConfiguration = {
  playerCount: number
  extensions: string[]
}

type GameSession = GameConfiguration & {
  id: string
  players: number[]
  deck_cartes: { 1: Carte[]; 2: Carte[]; 3: Carte[] }
  choices: { playerId: number; age: number; cardIndex: number }[]
}

const games = new Map<string, GameSession>()
const app = express()

app.use(express.json())

app.post('/api/games', (request, response) => {
  const body: unknown = request.body
  if (!isGameConfiguration(body)) {
    response.status(400).json({ error: 'Configuration de partie invalide.' })
    return
  }

  const session: GameSession = {
    id: randomUUID(),
    playerCount: body.playerCount,
    extensions: [...body.extensions],
    players: Array.from({ length: body.playerCount }, (_, index) => index + 1),
    deck_cartes: creerCartes(body.playerCount),
    choices: [],
  }

  games.set(session.id, session)
  response.status(201).json(session)
})

app.get('/api/games/:gameId', (request, response) => {
  const session = games.get(request.params.gameId)
  if (!session) {
    response.status(404).json({ error: 'Partie introuvable.' })
    return
  }

  response.json(session)
})

app.post('/api/games/:gameId/actions', (request, response) => {
  const session = games.get(request.params.gameId)
  if (!session) {
    response.status(404).json({ error: 'Partie introuvable.' })
    return
  }

  const action: unknown = request.body
  if (!isChooseCardAction(action)) {
    response.status(400).json({ error: 'Action invalide.' })
    return
  }

  if (!session.players.includes(action.playerId)) {
    response.status(400).json({ error: 'Joueur invalide.' })
    return
  }

  const deck = session.deck_cartes[action.age as 1 | 2 | 3]
  if (!deck || !Number.isInteger(action.cardIndex) || action.cardIndex < 0 || action.cardIndex >= deck.length) {
    response.status(400).json({ error: 'Carte invalide.' })
    return
  }

  const alreadyChosen = session.choices.some(
    (choice) => choice.playerId === action.playerId && choice.age === action.age,
  )
  if (alreadyChosen) {
    response.status(409).json({ error: 'Ce joueur a déjà choisi une carte pour cet âge.' })
    return
  }

  session.choices.push({
    playerId: action.playerId,
    age: action.age,
    cardIndex: action.cardIndex,
  })
  response.json(session)
})

app.listen(3001, () => {
  console.log('API Seven Wonders disponible sur http://localhost:3001')
})

function isGameConfiguration(value: unknown): value is GameConfiguration {
  if (typeof value !== 'object' || value === null || !('playerCount' in value) || !('extensions' in value)) {
    return false
  }

  return (
    typeof value.playerCount === 'number' &&
    Number.isInteger(value.playerCount) &&
    value.playerCount >= 2 &&
    value.playerCount <= 7 &&
    Array.isArray(value.extensions) &&
    value.extensions.every((extension) => typeof extension === 'string')
  )
}

function isChooseCardAction(
  value: unknown,
): value is { type: 'choose-card'; playerId: number; age: number; cardIndex: number } {
  if (typeof value !== 'object' || value === null) return false
  if (!('type' in value) || !('playerId' in value) || !('age' in value) || !('cardIndex' in value)) {
    return false
  }

  return (
    value.type === 'choose-card' &&
    typeof value.playerId === 'number' &&
    Number.isInteger(value.playerId) &&
    typeof value.age === 'number' &&
    Number.isInteger(value.age) &&
    value.age >= 1 &&
    value.age <= 3 &&
    typeof value.cardIndex === 'number' &&
    Number.isInteger(value.cardIndex)
  )
}