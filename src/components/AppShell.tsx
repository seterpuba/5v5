import type { ReactNode } from 'react'
import { BookOpen, CircleHelp, Gamepad2, Library, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { isCloudConfigured } from '../lib/gameStore'
import { Brand } from './Brand'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Brand compact />
        <span className="topbar__mode">Moderátorský režim</span>
        <span className="connection-pill"><i /> {isCloudConfigured ? 'Online synchronizácia' : 'Lokálny režim'}</span>
      </header>
      <aside className="sidebar">
        <nav>
          <NavLink to="/admin" end><Gamepad2 size={20} /> Prehľad</NavLink>
          <NavLink to="/admin/questions"><Library size={20} /> Otázky</NavLink>
          <NavLink to="/rules"><BookOpen size={20} /> Pravidlá</NavLink>
          <NavLink to="/help"><CircleHelp size={20} /> Ako hrať</NavLink>
          <NavLink to="/settings"><Settings size={20} /> Nastavenia</NavLink>
        </nav>
      </aside>
      <main className="app-content">{children}</main>
    </div>
  )
}
