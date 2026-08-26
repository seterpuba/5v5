import type { AnswerSlot } from '../types'

export function AnswerBoard({ answers, control = false, onReveal }: {
  answers: AnswerSlot[]
  control?: boolean
  onReveal?: (id: string) => void
}) {
  if (!answers.length) {
    return <div className="board-empty">Otázka zatiaľ nie je zobrazená</div>
  }

  return (
    <div className={`answer-board ${answers.length > 6 ? 'answer-board--dense' : ''}`}>
      {answers.map((answer) => (
        <button
          type="button"
          className={`answer-tile ${answer.revealed ? 'answer-tile--revealed' : ''} ${control ? 'answer-tile--control' : ''}`}
          key={answer.id}
          onClick={() => control && !answer.revealed && onReveal?.(answer.id)}
          disabled={!control || answer.revealed}
        >
          <span className="answer-tile__number">{answer.position}</span>
          <span className="answer-tile__text">{answer.revealed || control ? answer.text : ''}</span>
          <span className="answer-tile__points">{answer.revealed || control ? answer.points : ''}</span>
          {!answer.revealed && !control && <span className="answer-tile__cover" />}
        </button>
      ))}
    </div>
  )
}
