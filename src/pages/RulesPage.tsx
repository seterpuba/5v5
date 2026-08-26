import { Clock3, FastForward, ShieldCheck, Trophy, Users, X } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { gameRules } from '../game/rules'

export function RulesPage() {
  return (
    <AppShell>
      <section className="page-heading"><div><span className="eyebrow">Oficiálne nastavenie aplikácie</span><h1>Pravidlá hry</h1><p>Jednoduché pre hráčov, presné pre moderátora.</p></div></section>
      <div className="rules-grid">
        <article className="rule-card"><div className="rule-card__icon"><Users /></div><span>01</span><h2>Úvodný duel</h2><p>Z každého tímu príde jeden hráč. Kto prvý povie správnu odpoveď s vyššou hernou hodnotou, získava kontrolu. Tím môže hrať alebo otázku posunúť súperovi.</p></article>
        <article className="rule-card"><div className="rule-card__icon"><X /></div><span>02</span><h2>Tri chyby</h2><p>Tím postupne hľadá všetky odpovede. Po troch nesprávnych pokusoch dostane súper jednu šancu ukradnúť celý bank kola.</p></article>
        <article className="rule-card"><div className="rule-card__icon"><Trophy /></div><span>03</span><h2>Pridelenie banku</h2><p>Pri úspešnej krádeži získava bank súper. Ak neuspeje, bank dostáva pôvodný tím. Moderátor potvrdí výsledok jedným tlačidlom.</p></article>
        <article className="rule-card"><div className="rule-card__icon"><FastForward /></div><span>04</span><h2>Rýchla päťka</h2><p>Dvaja hráči odpovedajú na rovnakých päť otázok. Prvý má {gameRules.firstFinalSeconds} sekúnd, druhý {gameRules.secondFinalSeconds}. Spoločným cieľom je {gameRules.finalTarget} bodov.</p></article>
      </div>
      <section className="round-table panel">
        <div><span className="eyebrow">Bodovanie</span><h2>Priebeh zápasu</h2></div>
        {gameRules.rounds.map((round) => <div className="round-row" key={round.number}><b>{round.number}</b><span>{round.label}</span><strong>{round.number < 5 ? `×${round.multiplier} body` : `cieľ ${gameRules.finalTarget}`}</strong></div>)}
      </section>
      <section className="fair-play-note"><ShieldCheck /><div><h2>Čistá a overená hra</h2><p>Otázky neobsahujú 18+ obsah, vulgarizmy ani ponižovanie. Body vychádzajú zo zverejnených prieskumov alebo štatistických rebríčkov a každá otázka má uvedený zdroj aj vzorku.</p></div></section>
      <section className="moderator-tips"><h2>Tipy pre moderátora</h2><ul><li><Clock3 /> Pred hrou otestujte zvuk a režim celej obrazovky.</li><li><Users /> Počas úvodu kola vidí otázku a všetky odpovede iba moderátor; prezentácia ich odhalí až po potvrdení.</li><li><Trophy /> Ak prieskum umožnil viac odpovedí, súčet bodov na tabuli môže byť vyšší než 100.</li></ul></section>
    </AppShell>
  )
}
