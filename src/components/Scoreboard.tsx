import type { GameState } from '../types'

export function Scoreboard({ game, compact = false }: { game: GameState; compact?: boolean }) {
  return (
    <div className={`scoreboard ${compact ? 'scoreboard--compact' : ''}`}>
      {game.teams.map((team, index) => (
        <div className={`score-team ${game.controllingTeam === index ? 'score-team--active' : ''}`} key={team.id}>
          <span className="score-team__dot" style={{ background: team.color }} />
          <span className="score-team__name">{team.name}</span>
          <strong>{team.score}</strong>
        </div>
      ))}
    </div>
  )
}
