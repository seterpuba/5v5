import { describe, expect, it } from 'vitest'
import { questions } from './questions'

const prohibited = ['sex', 'porno', 'alkohol', 'droga', 'hazard', 'nahý', 'naked']

describe('verified question bank', () => {
  it('contains only approved family-friendly questions', () => {
    for (const question of questions) {
      expect(question.familyFriendly).toBe(true)
      expect(question.kind).toBe('survey')
      expect(question.status).toBe('surveyed')
      const searchable = [question.prompt, ...question.answers.flatMap((answer) => [answer.text, ...answer.aliases])].join(' ').toLowerCase()
      for (const word of prohibited) expect(searchable).not.toContain(word)
    }
  })

  it('has a complete source record for every question', () => {
    for (const question of questions) {
      expect(question.source.label.length).toBeGreaterThan(5)
      expect(() => new URL(question.source.url)).not.toThrow()
      expect(question.source.url.startsWith('https://')).toBe(true)
      expect(question.source.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(question.source.note?.length).toBeGreaterThan(15)
    }
  })

  it('uses unique question and answer identifiers with positive points', () => {
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length)
    for (const question of questions) {
      expect(question.answers.length).toBeGreaterThanOrEqual(2)
      expect(new Set(question.answers.map((answer) => answer.id)).size).toBe(question.answers.length)
      for (const answer of question.answers) expect(answer.points).toBeGreaterThan(0)
    }
  })
})
