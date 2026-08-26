import { Check, Download, ExternalLink, Filter, Search, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { questions } from '../data/questions'

export function QuestionBankPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Všetky')
  const categories = ['Všetky', ...Array.from(new Set(questions.map((item) => item.category)))]
  const visible = useMemo(() => questions.filter((item) => {
    const matchesText = item.prompt.toLowerCase().includes(query.toLowerCase()) || item.answers.some((answer) => answer.text.toLowerCase().includes(query.toLowerCase()))
    return matchesText && (category === 'Všetky' || item.category === category)
  }), [query, category])

  function exportQuestions() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), questions }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = '5-na-5-overene-otazky.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppShell>
      <section className="page-heading">
        <div><span className="eyebrow">Obsah hry</span><h1>Prieskumové otázky</h1><p>Prirodzené otázky v štýle 5 proti 5 s dohľadateľnými dátami.</p></div>
        <button className="button button--secondary" onClick={exportQuestions}><Download size={18} /> Exportovať JSON</button>
      </section>
      <div className="quality-note"><ShieldCheck /><div><strong>Family-friendly a bez vymyslených bodov</strong><span>Bez 18+ obsahu, vulgarizmov a ponižovania. Body vychádzajú zo zverejnených prieskumov; presná vzorka je uvedená pri zdroji.</span></div></div>
      <div className="question-toolbar">
        <label className="search-input"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hľadať otázku alebo odpoveď…" /></label>
        <label className="select-input"><Filter size={18} /><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="question-list">
        {visible.map((question, index) => (
          <article className="question-card" key={question.id}>
            <div className="question-card__number">{String(index + 1).padStart(2, '0')}</div>
            <div className="question-card__body">
              <div className="question-card__meta"><span>{question.category}</span><span className="verified"><Check size={13} /> Overený prieskum</span></div>
              <h2>{question.prompt}</h2>
              <div className="answer-chips">{question.answers.map((answer) => <span key={answer.id}>{answer.text} <b>{answer.points}</b></span>)}</div>
              <p className="scoring-note">{question.scoringNote}</p>
              <a className="source-link" href={question.source.url} target="_blank" rel="noreferrer">{question.source.label} <ExternalLink size={14} /></a>
              {question.source.note && <p className="source-note">{question.source.note}</p>}
            </div>
          </article>
        ))}
        {!visible.length && <div className="empty-state">Nenašli sa žiadne zodpovedajúce otázky.</div>}
      </div>
    </AppShell>
  )
}
