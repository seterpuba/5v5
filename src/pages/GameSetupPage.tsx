import { ArrowLeft, ArrowRight, Check, MonitorPlay, ShieldCheck, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { questionPacks, questions } from '../data/questions'
import { createGame } from '../game/engine'
import { saveGame } from '../lib/gameStore'

export function GameSetupPage() {
  const [teamA, setTeamA] = useState('Modrí')
  const [teamB, setTeamB] = useState('Oranžoví')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function start() {
    setBusy(true)
    const game = createGame(teamA, teamB, questionPacks[0].questionIds)
    await saveGame(game)
    navigate(`/control/${game.id}`)
  }

  return (
    <div className="setup-page">
      <header className="simple-header"><Brand compact /><Link to="/admin"><ArrowLeft size={18} /> Späť do centra</Link></header>
      <main className="setup-card">
        <span className="eyebrow">Nová hra</span>
        <h1>Pripravme súboj</h1>
        <p>Názvy môžete počas hry neskôr upraviť v nastaveniach.</p>
        <div className="team-fields">
          <label><span><i className="team-dot team-dot--blue" /> Tím A</span><input maxLength={24} value={teamA} onChange={(event) => setTeamA(event.target.value)} /></label>
          <div className="versus">VS</div>
          <label><span><i className="team-dot team-dot--orange" /> Tím B</span><input maxLength={24} value={teamB} onChange={(event) => setTeamB(event.target.value)} /></label>
        </div>
        <div className="pack-card">
          <div className="pack-card__icon"><ShieldCheck /></div>
          <div><span>Vybraný balík</span><strong>{questionPacks[0].name}</strong><small>{questions.length} overených otázok • bez 18+ obsahu</small></div>
          <Check className="pack-card__check" />
        </div>
        <div className="setup-preview">
          <span><Users /> 2 tímy po 5 hráčov</span><span><MonitorPlay /> Samostatná prezentácia</span><span><ShieldCheck /> Overené zdroje</span>
        </div>
        <button className="button button--primary button--large setup-submit" disabled={busy || !teamA.trim() || !teamB.trim()} onClick={start}>
          {busy ? 'Pripravujem…' : 'Vytvoriť hru'} <ArrowRight size={20} />
        </button>
      </main>
    </div>
  )
}
