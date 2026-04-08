import { useState } from 'react'
import { phrasesDefaut } from '../data/phrases'

const labels = {
  prendre: '🟢 Je prends le dossier',
  secteur: '🔴 Hors secteur',
  marque:  '🔴 Marque non couverte',
  appareil:'🔴 Appareil non réparé',
  info:    '🟡 Demander plus d\'info',
}

export default function Phrases() {
  const [phrases, setPhrases] = useState(phrasesDefaut)
  const [saved, setSaved] = useState(false)

  function update(key, val) {
    setPhrases(p => ({ ...p, [key]: val }))
  }

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Phrases types</h2>
        <button className="btn btn-primary" onClick={save}>
          {saved ? '✓ Enregistré!' : 'Enregistrer'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: 12, fontSize: 12, color: '#666' }}>
        Utilise <strong style={{ color: '#1D9E75' }}>{'{prenom}'}</strong> pour insérer le prénom du client automatiquement.
        La date du prochain RDV disponible sera aussi insérée automatiquement depuis ton calendrier.
      </div>

      {Object.keys(phrases).map(key => (
        <div className="card" key={key}>
          <div className="card-title">{labels[key]}</div>
          <textarea
            value={phrases[key]}
            onChange={e => update(key, e.target.value)}
            style={{ width: '100%', minHeight: 120, lineHeight: 1.7 }}
          />
        </div>
      ))}
    </div>
  )
}