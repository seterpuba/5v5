import { ArrowRight, BookOpenCheck, MonitorPlay, ShieldCheck, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'

export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing__nav">
        <Brand />
        <Link className="button button--ghost" to="/rules">Pravidlá hry</Link>
      </header>
      <main className="hero">
        <div className="hero__copy">
          <span className="eyebrow"><ShieldCheck size={16} /> Rodinná hra bez 18+ obsahu</span>
          <h1>Veľká tímová hra.<br /><em>Vo vašej réžii.</em></h1>
          <p>Ovládajte otázky, odpovede, chyby aj body z mobilu. Hráči na veľkej obrazovke uvidia iba čistú hernú tabuľu.</p>
          <div className="hero__actions">
            <Link className="button button--primary button--large" to="/admin">Otvoriť moderátora <ArrowRight size={20} /></Link>
            <Link className="button button--secondary button--large" to="/admin/questions">Pozrieť otázky</Link>
          </div>
          <div className="trust-row">
            <span><BookOpenCheck /> Overené zdroje</span>
            <span><Smartphone /> Mobilný ovládač</span>
            <span><MonitorPlay /> TV prezentácia</span>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="mock-display">
            <div className="mock-display__score"><span>MODRÍ <b>120</b></span><span>ORANŽOVÍ <b>95</b></span></div>
            <h3>Ktoré štáty susedia so Slovenskom?</h3>
            {['ČESKO', 'POĽSKO', 'UKRAJINA', '', ''].map((answer, index) => (
              <div className={answer ? 'mock-answer mock-answer--on' : 'mock-answer'} key={index}><i>{index + 1}</i><span>{answer}</span><b>{answer ? 20 : ''}</b></div>
            ))}
          </div>
          <div className="glow glow--one" /><div className="glow glow--two" />
        </div>
      </main>
    </div>
  )
}
