import { ArrowRight, CheckCircle2, CloudOff, Gamepad2, Library, MonitorPlay, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { questions } from '../data/questions'
import { getActiveGameId } from '../lib/gameStore'

export function AdminDashboard() {
  const navigate = useNavigate()
  const activeGame = getActiveGameId()
  return (
    <AppShell>
      <section className="page-heading">
        <div><span className="eyebrow">Vitajte späť</span><h1>Herné centrum</h1><p>Pripravte novú hru alebo pokračujte v rozohranej relácii.</p></div>
        <Link className="button button--primary" to="/game/new"><Plus size={19} /> Nová hra</Link>
      </section>

      <div className="status-banner">
        <CloudOff size={22} />
        <div><strong>Lokálny demo režim</strong><span>Funguje medzi kartami tohto zariadenia. Pre mobil a projektor na rôznych zariadeniach neskôr pripojíme Supabase.</span></div>
      </div>

      <div className="dashboard-grid">
        <article className="panel panel--hero">
          <div className="panel__icon"><Gamepad2 /></div>
          <span className="panel__overline">Najbližší krok</span>
          <h2>{activeGame ? 'Pokračovať v hre' : 'Vytvorte svoju prvú hru'}</h2>
          <p>{activeGame ? 'Rozohraná hra je uložená v tomto zariadení.' : 'Pomenujte dva tímy, vyberte otázky a otvorte prezentáciu.'}</p>
          <button className="button button--light" onClick={() => navigate(activeGame ? `/control/${activeGame}` : '/game/new')}>
            {activeGame ? 'Otvoriť ovládač' : 'Nastaviť hru'} <ArrowRight size={18} />
          </button>
        </article>
        <article className="panel stat-panel">
          <div className="panel__icon panel__icon--blue"><Library /></div>
          <span>Schválené otázky</span><strong>{questions.length}</strong>
          <small><CheckCircle2 size={15} /> všetky majú uvedený zdroj</small>
          <Link to="/admin/questions">Otvoriť databázu <ArrowRight size={16} /></Link>
        </article>
        <article className="panel stat-panel">
          <div className="panel__icon panel__icon--orange"><MonitorPlay /></div>
          <span>Prezentačný režim</span><strong>16 : 9</strong>
          <small>Optimalizovaný pre TV a projektor</small>
          {activeGame ? <Link to={`/present/${activeGame}`}>Otvoriť prezentáciu <ArrowRight size={16} /></Link> : <span className="muted-link">Najprv vytvorte hru</span>}
        </article>
      </div>
    </AppShell>
  )
}
