import { Maximize, Volume2, VolumeX, WifiOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AnswerBoard } from '../components/AnswerBoard'
import { Brand } from '../components/Brand'
import { Scoreboard } from '../components/Scoreboard'
import { gameRules } from '../game/rules'
import { isCloudConfigured, loadPublicGame, subscribeToCloudGame, subscribeToLocalGame } from '../lib/gameStore'
import type { GameState } from '../types'

export function PresentationPage() {
  const { gameId = '' } = useParams()
  const [game, setGame] = useState<GameState | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastUpdate = useRef('')

  useEffect(() => {
    void loadPublicGame(gameId).then((value) => { if (value) { setGame(value); lastUpdate.current = value.updatedAt } })
    const unsubLocal = subscribeToLocalGame((value) => {
      if (value.id === gameId || value.shareCode === gameId) { setGame(value); lastUpdate.current = value.updatedAt }
    })
    const unsubCloud = subscribeToCloudGame(gameId, (value) => { setGame(value); lastUpdate.current = value.updatedAt })
    return () => { unsubLocal(); unsubCloud() }
  }, [gameId])

  useEffect(() => {
    if (game?.phase === 'intro') {
      videoRef.current?.load()
      void videoRef.current?.play().catch(() => undefined)
    }
  }, [game?.phase, game?.roundIndex, game?.updatedAt])

  if (!game) return <div className="presentation presentation--waiting"><Brand /><h1>Čakám na hru</h1><p>Kód: {gameId}</p>{!isCloudConfigured && <span><WifiOff /> Na inom zariadení bude potrebné pripojenie Supabase.</span>}</div>
  const round = gameRules.rounds[game.roundIndex]
  const intro = game.phase === 'intro'

  return (
    <div className="presentation">
      <header className="presentation__header"><Brand compact /><Scoreboard game={game} /><div className="round-chip"><span>{round.label}</span><b>×{round.multiplier}</b></div></header>
      {intro ? (
        <div className="round-intro"><video ref={videoRef} src={round.introVideo} playsInline /></div>
      ) : game.phase === 'final' ? (
        <FinalPresentation game={game} />
      ) : (
        <main className="presentation__main">
          <div className="presentation__question"><span>OTÁZKA {game.questionIndex + 1}</span><h1>{game.questionPrompt || game.message}</h1></div>
          <AnswerBoard answers={game.answers} />
          <div className="presentation__bottom">
            <div className="strike-row strike-row--large">{[0, 1, 2].map((index) => <i className={index < game.strikes ? 'strike strike--on' : 'strike'} key={index}>×</i>)}</div>
            <div className="bank-display"><span>BANK</span><strong>{game.roundBank}</strong></div>
          </div>
        </main>
      )}
      {!!game.message && !intro && <div className="presentation__message">{game.message}</div>}
      <div className="presentation__tools">
        <button onClick={() => document.documentElement.requestFullscreen?.()} aria-label="Celá obrazovka"><Maximize /></button>
        <span>{game.muted ? <VolumeX /> : <Volume2 />}</span>
      </div>
    </div>
  )
}

function FinalPresentation({ game }: { game: GameState }) {
  const total = game.final.rows.reduce((sum, row) => sum + (row.playerOne.revealed ? row.playerOne.points : 0) + (row.playerTwo.revealed ? row.playerTwo.points : 0), 0)
  return <main className="final-presentation">
    <div className="final-presentation__heading"><span>RÝCHLA PÄŤKA</span><h1>Spoločný cieľ: {gameRules.finalTarget} bodov</h1></div>
    <div className="final-presentation__table">
      <div className="final-table-head"><span>OTÁZKA</span><span>HRÁČ 1</span><span>BODY</span><span>HRÁČ 2</span><span>BODY</span></div>
      {game.final.rows.map((row, index) => <div className="final-table-row" key={row.questionId}>
        <b>{index + 1}</b>
        <span className="final-table-question">{row.prompt}</span>
        <span>{row.playerOne.revealed ? row.playerOne.text : '••••••'}</span><strong>{row.playerOne.revealed ? row.playerOne.points : '—'}</strong>
        <span>{row.playerTwo.revealed ? row.playerTwo.text : '••••••'}</span><strong>{row.playerTwo.revealed ? row.playerTwo.points : '—'}</strong>
      </div>)}
    </div>
    <div className="final-presentation__footer">
      <div className={game.final.running ? 'final-clock final-clock--running' : 'final-clock'}><span>ČAS</span><b>{game.final.secondsLeft}</b></div>
      <div className={total >= gameRules.finalTarget ? 'final-grand-total final-grand-total--winner' : 'final-grand-total'}><span>SPOLU</span><b>{total}</b><small>/ {gameRules.finalTarget}</small></div>
    </div>
  </main>
}
