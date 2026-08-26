import { questionById } from '../data/questions'
import type { AnswerSlot, GameAction, GameState } from '../types'
import { gameRules } from './rules'

const now = () => new Date().toISOString()

function normalizeAnswer(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
}

function makeFinalRows(questionIds: string[]) {
  return questionIds.slice(0, 5).map((questionId) => ({
    questionId,
    prompt: questionById.get(questionId)?.prompt ?? '',
    playerOne: { text: '', points: 0, revealed: false },
    playerTwo: { text: '', points: 0, revealed: false },
  }))
}

export function makeShareCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = new Uint8Array(6)
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes)
  else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256)
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')
}

export function makeGameId(): string {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `game-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function createGame(
  teamA: string,
  teamB: string,
  questionIds: string[],
): GameState {
  return {
    id: makeGameId(),
    shareCode: makeShareCode(),
    title: '5 na 5',
    phase: 'lobby',
    teams: [
      { id: 'a', name: teamA.trim() || 'Modrí', color: '#35a7ff', score: 0 },
      { id: 'b', name: teamB.trim() || 'Oranžoví', color: '#ff8a36', score: 0 },
    ],
    activeTeam: 0,
    controllingTeam: 0,
    roundIndex: 0,
    questionIndex: 0,
    questionIds,
    currentQuestionId: null,
    questionPrompt: '',
    answers: [],
    strikes: 0,
    roundBank: 0,
    message: 'Hra je pripravená',
    muted: false,
    final: {
      player: 1,
      currentIndex: 0,
      secondsLeft: gameRules.firstFinalSeconds,
      running: false,
      rows: makeFinalRows(questionIds),
    },
    updatedAt: now(),
  }
}

function slotsForQuestion(questionId: string): AnswerSlot[] {
  const question = questionById.get(questionId)
  if (!question) return []
  return question.answers.map((answer, index) => ({
    id: answer.id,
    position: index + 1,
    text: answer.text,
    points: answer.points,
    revealed: false,
  }))
}

function loadQuestion(state: GameState, index: number): GameState {
  const questionId = state.questionIds[index % state.questionIds.length]
  const question = questionById.get(questionId)
  if (!question) return state
  return {
    ...state,
    phase: 'question',
    currentQuestionId: question.id,
    questionPrompt: question.prompt,
    answers: slotsForQuestion(question.id),
    strikes: 0,
    roundBank: 0,
    message: `Otázka ${index + 1}`,
  }
}

function withTimestamp(state: GameState): GameState {
  return { ...state, updatedAt: now() }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  let next = state
  const multiplier = gameRules.rounds[Math.min(state.roundIndex, 3)]?.multiplier ?? 1

  switch (action.type) {
    case 'START_ROUND':
      next = { ...state, phase: 'intro', strikes: 0, roundBank: 0, message: gameRules.rounds[state.roundIndex]?.label ?? 'Ďalšie kolo' }
      break
    case 'SHOW_QUESTION':
      next = loadQuestion(state, state.questionIndex)
      break
    case 'REVEAL_ANSWER': {
      const target = state.answers.find((answer) => answer.id === action.answerId)
      if (!target || target.revealed) return state
      next = {
        ...state,
        answers: state.answers.map((answer) => answer.id === action.answerId ? { ...answer, revealed: true } : answer),
        roundBank: state.roundBank + target.points * multiplier,
        message: `${target.text} — ${target.points * multiplier} bodov`,
      }
      break
    }
    case 'ADD_STRIKE':
      next = {
        ...state,
        strikes: Math.min(gameRules.strikeLimit, state.strikes + 1),
        phase: state.strikes + 1 >= gameRules.strikeLimit ? 'steal' : state.phase,
        message: state.strikes + 1 >= gameRules.strikeLimit ? 'Šanca na krádež!' : 'Nesprávna odpoveď',
      }
      break
    case 'REMOVE_STRIKE':
      next = { ...state, strikes: Math.max(0, state.strikes - 1), phase: 'question', message: 'Chyba bola odobratá' }
      break
    case 'SET_CONTROLLING_TEAM':
      next = { ...state, controllingTeam: action.team, activeTeam: action.team, message: `Hrá tím ${state.teams[action.team].name}` }
      break
    case 'AWARD_BANK':
      next = {
        ...state,
        phase: 'round-result',
        teams: state.teams.map((team, index) => index === action.team ? { ...team, score: team.score + state.roundBank } : team) as GameState['teams'],
        message: `${state.teams[action.team].name} získava ${state.roundBank} bodov`,
      }
      break
    case 'ADJUST_SCORE':
      next = {
        ...state,
        teams: state.teams.map((team, index) => index === action.team ? { ...team, score: Math.max(0, team.score + action.amount) } : team) as GameState['teams'],
        message: 'Skóre bolo upravené',
      }
      break
    case 'NEXT_QUESTION':
      next = loadQuestion({ ...state, questionIndex: state.questionIndex + 1 }, state.questionIndex + 1)
      break
    case 'NEXT_ROUND': {
      const roundIndex = Math.min(gameRules.rounds.length - 1, state.roundIndex + 1)
      next = {
        ...state,
        roundIndex,
        questionIndex: state.questionIndex + 1,
        currentQuestionId: null,
        questionPrompt: '',
        answers: [],
        strikes: 0,
        roundBank: 0,
        phase: roundIndex === 4 ? 'final' : 'intro',
        final: roundIndex === 4 ? {
          player: 1,
          currentIndex: 0,
          secondsLeft: gameRules.firstFinalSeconds,
          running: false,
          rows: makeFinalRows(state.questionIds.slice(state.questionIndex + 1)),
        } : state.final,
        message: gameRules.rounds[roundIndex].label,
      }
      break
    }
    case 'SET_PHASE':
      next = { ...state, phase: action.phase }
      break
    case 'SET_MESSAGE':
      next = { ...state, message: action.message }
      break
    case 'TOGGLE_MUTE':
      next = { ...state, muted: !state.muted }
      break
    case 'FINAL_START_PLAYER':
      next = {
        ...state,
        phase: 'final',
        final: {
          ...state.final,
          player: action.player,
          currentIndex: 0,
          secondsLeft: action.player === 1 ? gameRules.firstFinalSeconds : gameRules.secondFinalSeconds,
          running: false,
        },
        message: `Rýchla päťka — hráč ${action.player}`,
      }
      break
    case 'FINAL_TOGGLE_TIMER':
      next = { ...state, final: { ...state.final, running: !state.final.running } }
      break
    case 'FINAL_TICK':
      next = state.final.running && state.final.secondsLeft > 0
        ? { ...state, final: { ...state.final, secondsLeft: state.final.secondsLeft - 1, running: state.final.secondsLeft > 1 } }
        : state
      break
    case 'FINAL_SAVE_ANSWER': {
      const row = state.final.rows[state.final.currentIndex]
      if (!row) return state
      const question = questionById.get(row.questionId)
      const normalized = normalizeAnswer(action.text)
      const match = question?.answers.find((answer) => [answer.text, ...answer.aliases].some((candidate) => normalizeAnswer(candidate) === normalized))
      const key = state.final.player === 1 ? 'playerOne' : 'playerTwo'
      const duplicate = state.final.player === 2 && normalizeAnswer(row.playerOne.text) === normalized && normalized.length > 0
      next = {
        ...state,
        final: {
          ...state.final,
          rows: state.final.rows.map((item, index) => index === state.final.currentIndex ? {
            ...item,
            [key]: { text: action.text.trim() || '—', points: duplicate ? 0 : match?.points ?? 0, revealed: false },
          } : item),
        },
        message: duplicate ? 'Odpoveď sa opakuje — zadajte inú' : 'Odpoveď uložená',
      }
      break
    }
    case 'FINAL_NEXT_QUESTION':
      next = {
        ...state,
        final: { ...state.final, currentIndex: Math.min(state.final.rows.length - 1, state.final.currentIndex + 1) },
      }
      break
    case 'FINAL_REVEAL': {
      const key = action.player === 1 ? 'playerOne' : 'playerTwo'
      next = {
        ...state,
        final: {
          ...state.final,
          rows: state.final.rows.map((row, index) => index === action.row ? { ...row, [key]: { ...row[key], revealed: true } } : row),
        },
        message: 'Body odhalené',
      }
      break
    }
    case 'FINAL_REVEAL_ALL':
      next = {
        ...state,
        final: {
          ...state.final,
          rows: state.final.rows.map((row) => ({ ...row, playerOne: { ...row.playerOne, revealed: true }, playerTwo: { ...row.playerTwo, revealed: true } })),
        },
        message: 'Výsledok Rýchlej päťky',
      }
      break
    case 'RESET_GAME':
      next = {
        ...createGame(state.teams[0].name, state.teams[1].name, state.questionIds),
        id: state.id,
        shareCode: state.shareCode,
      }
      break
  }

  return withTimestamp(next)
}

export function publicGameState(state: GameState): GameState {
  return {
    ...state,
    answers: state.answers.map((answer) => answer.revealed ? answer : { ...answer, text: '', points: 0 }),
    questionIds: [],
    currentQuestionId: null,
    final: {
      ...state.final,
      rows: state.final.rows.map((row) => ({
        ...row,
        playerOne: row.playerOne.revealed ? row.playerOne : { ...row.playerOne, text: '', points: 0 },
        playerTwo: row.playerTwo.revealed ? row.playerTwo : { ...row.playerTwo, text: '', points: 0 },
      })),
    },
  }
}
