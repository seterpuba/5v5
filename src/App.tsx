import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminDashboard } from './pages/AdminDashboard'
import { ControlPage } from './pages/ControlPage'
import { GameSetupPage } from './pages/GameSetupPage'
import { HelpPage, SettingsPage } from './pages/InfoPages'
import { LandingPage } from './pages/LandingPage'
import { PresentationPage } from './pages/PresentationPage'
import { QuestionBankPage } from './pages/QuestionBankPage'
import { RulesPage } from './pages/RulesPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/questions" element={<QuestionBankPage />} />
      <Route path="/game/new" element={<GameSetupPage />} />
      <Route path="/control/:gameId" element={<ControlPage />} />
      <Route path="/present/:gameId" element={<PresentationPage />} />
      <Route path="/rules" element={<RulesPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
