import { Cloud, Copy, Download, KeyRound, MonitorPlay, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { getCloudDeviceIdentity, isCloudConfigured } from '../lib/gameStore'

export function HelpPage() {
  return <AppShell><section className="page-heading"><div><span className="eyebrow">Rýchly návod</span><h1>Ako spustiť hru</h1></div></section><div className="steps-list">
    <article><b>1</b><div><h2>Vytvorte hru</h2><p>Zadajte názvy tímov a potvrďte overený balík otázok.</p></div></article>
    <article><b>2</b><div><h2>Otvorte prezentáciu</h2><p>V ovládači stlačte Prezentácia. Novú kartu presuňte na projektor alebo TV.</p></div><MonitorPlay /></article>
    <article><b>3</b><div><h2>Ovládajte z mobilu</h2><p>Po pripojení cloudu otvoríte moderátorskú adresu v mobile. V demo režime použite dve karty jedného zariadenia.</p></div><Smartphone /></article>
    <article><b>4</b><div><h2>Spustite úvod kola</h2><p>Video sa prehrá na projektore, potom zobrazíte otázku a postupne odhaľujete odpovede.</p></div></article>
  </div></AppShell>
}

export function SettingsPage() {
  const [deviceId, setDeviceId] = useState<string | null>(null)
  useEffect(() => { if (isCloudConfigured) void getCloudDeviceIdentity().then(setDeviceId) }, [])
  return <AppShell><section className="page-heading"><div><span className="eyebrow">Aplikácia</span><h1>Nastavenia</h1><p>Stav pripojenia a bezpečnostné informácie.</p></div></section><div className="settings-grid">
    <article className="setting-card"><Cloud /><div><span>Synchronizácia</span><h2>{isCloudConfigured ? 'Supabase je pripojený' : 'Lokálny demo režim'}</h2><p>{isCloudConfigured ? 'Mobil a prezentácia sa môžu synchronizovať cez internet.' : 'Doplnením dvoch premenných prostredia sa aktivuje synchronizácia medzi zariadeniami.'}</p></div></article>
    <article className="setting-card"><KeyRound /><div><span>Administrátor</span><h2>Jedno správcovské zariadenie</h2><p>V cloudovom režime chráni zmeny databázová politika. Verejná prezentácia nemá prístup k skrytým odpovediam.</p>{deviceId && <button className="device-id" onClick={() => navigator.clipboard.writeText(deviceId)} title="Kopírovať ID"><code>{deviceId}</code><Copy size={14} /></button>}</div></article>
    <article className="setting-card"><Download /><div><span>Inštalácia</span><h2>Pridať na plochu</h2><p>V mobilnom prehliadači použite možnosť „Pridať na plochu“. Aplikácia sa potom otvorí bez lišty prehliadača.</p></div></article>
  </div></AppShell>
}
