import { ArrowLeft, ArrowRight, Clock3, ExternalLink, Eye, EyeOff, Maximize, Minus, Pause, Play, Plus, RotateCcw, Trophy, Volume2, VolumeX, X, Zap } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnswerBoard } from '../components/AnswerBoard'
import { Scoreboard } from '../components/Scoreboard'
import { gameReducer } from '../game/engine'
import { gameRules } from '../game/rules'
import { loadGame, saveGame, subscribeToLocalGame } from '../lib/gameStore'
import type { GameAction, GameState } from '../types'

function playSound(src: string, muted: boolean) {
  if (muted) return
  const audio = new Audio(src)
  void audio.play().catch(() => undefined)
}

export function ControlPage() {
  const { gameId = '' } = useParams()
  const [game, setGame] = useState<GameState | null>(null)
  const [history, setHistory] = useState<GameState[]>([])
  const loaded = useRef(false)

  useEffect(() => {
    void loadGame(gameId).then((value) => { setGame(value); loaded.current = true })
    return subscribeToLocalGame((value) => { if (value.id === gameId && !loaded.current) setGame(value) })
  }, [gameId])

  const dispatch = useCallback((action: GameAction, sound?: string) => {
    setGame((current) => {
      if (!current) return current
      setHistory((items) => [...items.slice(-19), current])
      const next = gameReducer(current, action)
      if (sound) playSound(sound, current.muted)
      void saveGame(next)
      return next
    })
  }, [])

  useEffect(() => {
    if (!game?.final.running) return
    const timer = window.setInterval(() => dispatch({ type: 'FINAL_TICK' }), 1000)
    return () => window.clearInterval(timer)
  }, [game?.final.running, dispatch])

  function undo() {
    const previous = history.at(-1)
    if (!previous) return
    setHistory((items) => items.slice(0, -1))
    setGame(previous)
    void saveGame(previous)
  }

  if (!game) return <div className="loading-screen">Načítavam ovládač…</div>
  const round = gameRules.rounds[game.roundIndex]
  const canShowQuestion = game.phase === 'lobby' || game.phase === 'intro' || game.phase === 'round-result'

  return (
    <div className="control-page">
      <header className="control-header">
        <Link to="/admin" className="icon-button"><ArrowLeft /></Link>
        <div><span>Moderátor</span><strong>{round.label} · ×{round.multiplier}</strong></div>
        <Scoreboard game={game} compact />
        <button className="icon-button" onClick={() => dispatch({ type: 'TOGGLE_MUTE' })}>{game.muted ? <VolumeX /> : <Volume2 />}</button>
        <a className="button button--secondary button--small" href={`/present/${game.shareCode}`} target="_blank" rel="noreferrer"><MonitorIcon /> Prezentácia <ExternalLink size={15} /></a>
      </header>

      <main className="control-layout">
        <section className="control-main">
          {game.phase === 'final' ? <FinalControl game={game} dispatch={dispatch} /> : <>
            <div className="control-question">
              <div className="control-question__meta"><span>Otázka {game.questionIndex + 1}</span><span>Bank <b>{game.roundBank}</b></span></div>
              <h1>{game.questionPrompt || 'Otázka ešte nie je zobrazená'}</h1>
            </div>
            <AnswerBoard answers={game.answers} control onReveal={(answerId) => dispatch({ type: 'REVEAL_ANSWER', answerId }, '/media/reveal.mp3')} />
            <div className="strike-control">
              <span>Chyby tímu</span>
              <div className="strike-row">{[0, 1, 2].map((index) => <i className={index < game.strikes ? 'strike strike--on' : 'strike'} key={index}>×</i>)}</div>
              <button className="button button--danger" onClick={() => dispatch({ type: 'ADD_STRIKE' }, '/media/x.mp3')} disabled={game.strikes >= 3}><X /> Chyba</button>
              <button className="icon-button" onClick={() => dispatch({ type: 'REMOVE_STRIKE' })} disabled={!game.strikes}><Minus /></button>
            </div>
          </>}
        </section>

        <aside className="control-side">
          <section className="control-panel">
            <span className="control-panel__label">Priebeh</span>
            {game.phase === 'final' && <>
              <button className="button button--primary button--wide" onClick={() => dispatch({ type: 'FINAL_START_PLAYER', player: 1 })}><Zap /> Hráč 1 · 20 s</button>
              <button className="button button--secondary button--wide" onClick={() => dispatch({ type: 'FINAL_START_PLAYER', player: 2 })}><Zap /> Hráč 2 · 25 s</button>
              <button className="button button--award button--wide" onClick={() => dispatch({ type: 'FINAL_REVEAL_ALL' }, '/media/reveal.mp3')}><Trophy /> Odhaliť všetky body</button>
            </>}
            {canShowQuestion && <button className="button button--primary button--wide" onClick={() => dispatch({ type: game.phase === 'intro' ? 'SHOW_QUESTION' : 'START_ROUND' })}>{game.phase === 'intro' ? <><Eye /> Zobraziť otázku</> : <><Maximize /> Spustiť úvod kola</>}</button>}
            {(game.phase === 'question' || game.phase === 'steal') && <button className="button button--secondary button--wide" onClick={() => dispatch({ type: 'NEXT_QUESTION' })}>Preskočiť otázku <ArrowRight /></button>}
            {game.phase === 'round-result' && <button className="button button--primary button--wide" onClick={() => dispatch({ type: 'NEXT_ROUND' })}>Ďalšie kolo <ArrowRight /></button>}
            <button className="button button--ghost button--wide" onClick={undo} disabled={!history.length}><RotateCcw /> Späť o krok</button>
          </section>

          {game.phase !== 'final' && <section className="control-panel">
            <span className="control-panel__label">Kto hrá?</span>
            {game.teams.map((team, index) => <button key={team.id} className={`team-control ${game.controllingTeam === index ? 'team-control--active' : ''}`} onClick={() => dispatch({ type: 'SET_CONTROLLING_TEAM', team: index as 0 | 1 })}><i style={{ background: team.color }} />{team.name}{game.controllingTeam === index && <Eye size={16} />}</button>)}
          </section>}

          {game.phase !== 'final' && <section className="control-panel">
            <span className="control-panel__label">Prideliť bank {game.roundBank}</span>
            {game.teams.map((team, index) => <button key={team.id} className="button button--award button--wide" disabled={!game.roundBank || game.phase === 'round-result'} onClick={() => dispatch({ type: 'AWARD_BANK', team: index as 0 | 1 })}>{team.name} <Plus /></button>)}
          </section>}

          <section className="control-panel score-adjust">
            <span className="control-panel__label">Ručná oprava skóre</span>
            {game.teams.map((team, index) => <div key={team.id}><span>{team.name}</span><button onClick={() => dispatch({ type: 'ADJUST_SCORE', team: index as 0 | 1, amount: -10 })}>−10</button><button onClick={() => dispatch({ type: 'ADJUST_SCORE', team: index as 0 | 1, amount: 10 })}>+10</button></div>)}
          </section>
        </aside>
      </main>
      <footer className="control-footer"><span>Kód prezentácie: <b>{game.shareCode}</b></span><span>{game.message}</span><button onClick={() => dispatch({ type: 'SET_MESSAGE', message: '' })}><EyeOff size={16} /> Vyčistiť hlášku</button></footer>
    </div>
  )
}

function MonitorIcon() { return <span aria-hidden="true">▣</span> }

function FinalControl({ game, dispatch }: { game: GameState; dispatch: (action: GameAction, sound?: string) => void }) {
  const [answer, setAnswer] = useState('')
  const current = game.final.rows[game.final.currentIndex]
  const total = game.final.rows.reduce((sum, row) => sum + (row.playerOne.revealed ? row.playerOne.points : 0) + (row.playerTwo.revealed ? row.playerTwo.points : 0), 0)
  const playerKey = game.final.player === 1 ? 'playerOne' : 'playerTwo'

  function save() {
    dispatch({ type: 'FINAL_SAVE_ANSWER', text: answer })
    setAnswer('')
  }

  return <div className="final-control">
    <div className="final-control__top">
      <div><span>Rýchla päťka</span><strong>Hráč {game.final.player} · otázka {game.final.currentIndex + 1}/5</strong></div>
      <button className={`final-timer ${game.final.running ? 'final-timer--running' : ''}`} onClick={() => dispatch({ type: 'FINAL_TOGGLE_TIMER' })}>{game.final.running ? <Pause /> : <Play />}<b>{game.final.secondsLeft}</b><small>s</small></button>
      <div className="final-total"><span>ODHALENÉ BODY</span><b>{total}</b><small>/ {gameRules.finalTarget}</small></div>
    </div>
    <div className="final-prompt"><Clock3 /><h1>{current?.prompt ?? 'Finále je pripravené'}</h1></div>
    <form className="final-answer-form" onSubmit={(event) => { event.preventDefault(); save() }}>
      <input autoFocus value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={`Zapíšte odpoveď hráča ${game.final.player}`} />
      <button className="button button--primary" disabled={!answer.trim()}>Uložiť odpoveď</button>
    </form>
    <div className="final-review">
      {game.final.rows.map((row, index) => {
        const response = row[playerKey]
        return <button key={row.questionId} className={index === game.final.currentIndex ? 'final-review__row final-review__row--active' : 'final-review__row'} onClick={() => response.text && dispatch({ type: 'FINAL_REVEAL', row: index, player: game.final.player }, '/media/reveal.mp3')}>
          <b>{index + 1}</b><span>{response.text || 'Čaká na odpoveď'}</span><strong>{response.revealed ? response.points : response.text ? '?' : '—'}</strong>
        </button>
      })}
    </div>
    <button className="button button--secondary final-next" onClick={() => dispatch({ type: 'FINAL_NEXT_QUESTION' })} disabled={game.final.currentIndex >= 4}>Ďalšia otázka <ArrowRight /></button>
  </div>
}
