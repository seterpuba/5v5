export type QuestionKind = 'factual' | 'survey'
export type VerificationStatus = 'verified' | 'surveyed' | 'draft'

export interface QuestionSource {
  label: string
  url: string
  verifiedAt: string
  note?: string
}

export interface GameAnswer {
  id: string
  text: string
  aliases: string[]
  points: number
}

export interface GameQuestion {
  id: string
  prompt: string
  category: string
  kind: QuestionKind
  status: VerificationStatus
  familyFriendly: true
  scoringNote: string
  answers: GameAnswer[]
  source: QuestionSource
}

export interface Team {
  id: 'a' | 'b'
  name: string
  color: string
  score: number
}

export interface RoundDefinition {
  number: number
  label: string
  multiplier: number
  introVideo: string
}

export type GamePhase =
  | 'lobby'
  | 'intro'
  | 'question'
  | 'steal'
  | 'round-result'
  | 'final'
  | 'finished'

export interface AnswerSlot {
  id: string
  position: number
  text: string
  points: number
  revealed: boolean
}

export interface FinalPlayerAnswer {
  text: string
  points: number
  revealed: boolean
}

export interface FinalRow {
  questionId: string
  prompt: string
  playerOne: FinalPlayerAnswer
  playerTwo: FinalPlayerAnswer
}

export interface FinalState {
  player: 1 | 2
  currentIndex: number
  secondsLeft: number
  running: boolean
  rows: FinalRow[]
}

export interface GameState {
  id: string
  shareCode: string
  title: string
  phase: GamePhase
  teams: [Team, Team]
  activeTeam: 0 | 1
  controllingTeam: 0 | 1
  roundIndex: number
  questionIndex: number
  questionIds: string[]
  currentQuestionId: string | null
  questionPrompt: string
  answers: AnswerSlot[]
  strikes: number
  roundBank: number
  message: string
  muted: boolean
  final: FinalState
  updatedAt: string
}

export type GameAction =
  | { type: 'START_ROUND' }
  | { type: 'SHOW_QUESTION' }
  | { type: 'REVEAL_ANSWER'; answerId: string }
  | { type: 'ADD_STRIKE' }
  | { type: 'REMOVE_STRIKE' }
  | { type: 'SET_CONTROLLING_TEAM'; team: 0 | 1 }
  | { type: 'AWARD_BANK'; team: 0 | 1 }
  | { type: 'ADJUST_SCORE'; team: 0 | 1; amount: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'NEXT_ROUND' }
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'SET_MESSAGE'; message: string }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'FINAL_START_PLAYER'; player: 1 | 2 }
  | { type: 'FINAL_TICK' }
  | { type: 'FINAL_TOGGLE_TIMER' }
  | { type: 'FINAL_SAVE_ANSWER'; text: string }
  | { type: 'FINAL_NEXT_QUESTION' }
  | { type: 'FINAL_REVEAL'; row: number; player: 1 | 2 }
  | { type: 'FINAL_REVEAL_ALL' }
  | { type: 'RESET_GAME' }

export interface QuestionPack {
  id: string
  name: string
  description: string
  questionIds: string[]
}
