import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Courriels from './pages/Courriels'
import Regles from './pages/Regles'
import Region from './pages/Region'
import Phrases from './pages/Phrases'
import Calendrier from './pages/Calendrier'
import Formulaire from './pages/Formulaire'
import './App.css'

const tabs = [
  { id: 'courriels', label: 'Courriels' },
  { id: 'calendrier', label: 'Calendrier' },
  { id: 'regles', label: 'Règles' },
  { id: 'region', label: 'Région' },
  { id: 'phrases', label: 'Phrases types' },
]

function AppPrincipale() {
  const [activeTab, setActiveTab] = useState('courriels')

  return (
    <div className="app-container">
      <div className="topbar">
        <div className="topbar-inner">
          <div className="app-title">⚡ Monsieur Électro</div>
          <div className="tabs">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`tab ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="page-content">
        {activeTab === 'courriels' && <Courriels />}
        {activeTab === 'calendrier' && <Calendrier />}
        {activeTab === 'regles' && <Regles />}
        {activeTab === 'region' && <Region />}
        {activeTab === 'phrases' && <Phrases />}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/formulaire" element={<Formulaire />} />
        <Route path="/*" element={<AppPrincipale />} />
      </Routes>
    </BrowserRouter>
  )
}