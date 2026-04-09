import { useState } from 'react'
import { regionsDefaut } from '../data/regions'

export default function Region() {
  const [regions, setRegions] = useState(regionsDefaut)
  const [input, setInput] = useState('')
  const [saved, setSaved] = useState(false)

  function add() {
    const v = input.trim()
    if (!v || regions.includes(v)) return
    setRegions([...regions, v])
    setInput('')
  }

  function remove(i) {
    setRegions(regions.filter((_, idx) => idx !== i))
  }

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const villes = regions.filter(r => isNaN(r[0]) && r.length > 3)
  const codes = regions.filter(r => !isNaN(r[0]) || r.length <= 3)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Région couverte</h2>
        <button className="btn btn-primary" onClick={save}>
          {saved ? '✓ Enregistré!' : 'Enregistrer'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">Villes couvertes ({villes.length})</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {villes.map((r, i) => (
            <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: '#f0faf5', border: '1px solid #9FE1CB', borderRadius: 20, fontSize: 12 }}>
              {r}
              <span onClick={() => remove(regions.indexOf(r))} style={{ cursor: 'pointer', color: '#A32D2D', fontWeight: 600 }}>×</span>
            </div>
          ))}
        </div>

        <div className="card-title">Codes postaux couverts ({codes.length})</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {codes.map((r) => (
            <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: '#E6F1FB', border: '1px solid #B5D4F4', borderRadius: 20, fontSize: 12 }}>
              {r}
              <span onClick={() => remove(regions.indexOf(r))} style={{ cursor: 'pointer', color: '#A32D2D', fontWeight: 600 }}>×</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Ville ou code postal (ex: G1E)..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            style={{ width: 280 }}
          />
          <button className="btn btn-primary" onClick={add}>+ Ajouter</button>
        </div>
      </div>

      <div className="card" style={{ fontSize: 12, color: '#666', lineHeight: 1.7 }}>
        <strong style={{ color: '#1a1a1a' }}>Comment ça fonctionne :</strong><br />
        Quand un courriel arrive, l'app vérifie automatiquement si la ville ou le code postal du client est dans ta liste.
        Si oui → 🟢 Probable. Si non → 🔴 Hors secteur.
      </div>
    </div>
  )
}