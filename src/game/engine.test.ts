import { describe, expect, it } from 'vitest'
import { questions } from '../data/questions'
import { createGame, gameReducer, publicGameState } from './engine'

describe('game engine', () => {
  it('never exposes a hidden answer in public state', () => {
    let game = createGame('A', 'B', [questions[0].id])
    game = gameReducer(game, { type: 'SHOW_QUESTION' })
    expect(game.answers[0].text).not.toBe('')
    expect(publicGameState(game).answers[0].text).toBe('')
  })

  it('preloads the next question for the moderator while keeping it off the public intro', () => {
    let game = createGame('A', 'B', [questions[0].id])
    game = gameReducer(game, { type: 'START_ROUND' })
    expect(game.phase).toBe('intro')
    expect(game.questionPrompt).toBe(questions[0].prompt)
    expect(game.answers[0].text).toBe(questions[0].answers[0].text)
    expect(publicGameState(game).questionPrompt).toBe('')
    expect(publicGameState(game).answers[0].text).toBe('')
  })

  it('applies the round multiplier when revealing an answer', () => {
    let game = createGame('A', 'B', [questions[0].id])
    game = gameReducer(game, { type: 'SHOW_QUESTION' })
    game = { ...game, roundIndex: 2 }
    game = gameReducer(game, { type: 'REVEAL_ANSWER', answerId: game.answers[0].id })
    expect(game.roundBank).toBe(game.answers[0].points * 2)
  })

  it('moves to steal after three strikes', () => {
    let game = createGame('A', 'B', [questions[0].id])
    game = gameReducer(game, { type: 'SHOW_QUESTION' })
    game = gameReducer(game, { type: 'ADD_STRIKE' })
    game = gameReducer(game, { type: 'ADD_STRIKE' })
    game = gameReducer(game, { type: 'ADD_STRIKE' })
    expect(game.phase).toBe('steal')
    expect(game.strikes).toBe(3)
  })

  it('awards the current bank to a team', () => {
    let game = createGame('A', 'B', [questions[0].id])
    game = gameReducer(game, { type: 'SHOW_QUESTION' })
    game = gameReducer(game, { type: 'REVEAL_ANSWER', answerId: game.answers[0].id })
    game = gameReducer(game, { type: 'AWARD_BANK', team: 1 })
    expect(game.teams[1].score).toBeGreaterThan(0)
    expect(game.teams[0].score).toBe(0)
  })

  it('scores an exact or aliased answer in the final', () => {
    let game = createGame('A', 'B', questions.slice(0, 6).map((question) => question.id))
    game = gameReducer({ ...game, phase: 'final' }, { type: 'FINAL_SAVE_ANSWER', text: 'večera' })
    expect(game.final.rows[0].playerOne.points).toBe(52)
  })

  it('does not expose unrevealed final answers publicly', () => {
    let game = createGame('A', 'B', questions.slice(0, 6).map((question) => question.id))
    game = gameReducer({ ...game, phase: 'final' }, { type: 'FINAL_SAVE_ANSWER', text: 'večera' })
    expect(game.final.rows[0].playerOne.text).toBe('večera')
    expect(publicGameState(game).final.rows[0].playerOne.text).toBe('')
  })
})
