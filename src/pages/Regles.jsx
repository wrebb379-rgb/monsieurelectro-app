import { useState } from 'react'
import { reglesDefaut } from '../data/regles'

const appareils = ['Laveuse','Sécheuse','Réfrigérateur','Congélateur','Lave-vaisselle','Cuisinière']

export default function Regles() {
  const [regles, setRegles] = useState(reglesDefaut)
  const [newMarque, setNewMarque] = useState('')
  const [saved, setSaved] = useState(false)

  function toggle(i, app) {
    const r = regles.map((row, idx) => {
      if (idx !== i) return row
      return { ...row, c: { ...row.c, [app]: [row.c[app][0] ? 0 : 1, row.c[app][1]] } }
    })
    setRegles(r)
  }

  function setNote(i, app, val) {
    const r = regles.map((row, idx) => {
      if (idx !== i) return row
      return { ...row, c: { ...row.c, [app]: [row.c[app][0], val] } }
    })
    setRegles(r)
  }

  function addMarque() {
    if (!newMarque.trim()) return
    const c = {}
    appareils.forEach(a => c[a] = [0, ''])
    setRegles([...regles, { m: newMarque.trim(), c }])
    setNewMarque('')
  }

  function removeMarque(i) {
    setRegles(regles.filter((_, idx) => idx !== i))
  }

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Règles de réparation</h2>
        <button className="btn btn-primary" onClick={save}>
          {saved ? '✓ Enregistré!' : 'Enregistrer'}
        </button>
      </div>

      <div className="card">
        <div className="card-title">Grille marque × appareil</div>
        <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
          Clique sur une case pour basculer ✅/❌. Ajoute une note pour les exceptions (ex: "frontale seul.").
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, color: '#888', background: '#f9f9f9', border: '1px solid #eee', minWidth: 120 }}>
                  Marque
                </th>
                {appareils.map(a => (
                  <th key={a} style={{ padding: '8px 6px', textAlign: 'center', fontSize: 11, color: '#888', background: '#f9f9f9', border: '1px solid #eee', minWidth: 90 }}>
                    {a}
                  </th>
                ))}
                <th style={{ padding: '8px 6px', background: '#f9f9f9', border: '1px solid #eee', width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {regles.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: '8px 12px', fontWeight: 500, fontSize: 13, border: '1px solid #eee', background: '#fafafa' }}>
                    {row.m}
                  </td>
                  {appareils.map(a => {
                    const on = row.c[a]?.[0]
                    const note = row.c[a]?.[1] || ''
                    return (
                      <td
                        key={a}
                        onClick={() => toggle(i, a)}
                        style={{
                          border: '1px solid #eee',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: on ? '#f0faf5' : '#fff5f5',
                          padding: '4px 2px',
                        }}
                      >
                        <div style={{ fontSize: 16 }}>{on ? '✅' : '❌'}</div>
                        <input
                          value={note}
                          placeholder="note..."
                          onClick={e => e.stopPropagation()}
                          onChange={e => setNote(i, a, e.target.value)}
                          style={{
                            width: 80, fontSize: 10, border: 'none', background: 'transparent',
                            textAlign: 'center', color: on ? '#0F6E56' : '#A32D2D',
                            outline: 'none', fontFamily: 'inherit',
                          }}
                        />
                      </td>
                    )
                  })}
                  <td style={{ border: '1px solid #eee', textAlign: 'center' }}>
                    <button
                      onClick={() => removeMarque(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A32D2D', fontSize: 16 }}
                    >×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Nouvelle marque..."
            value={newMarque}
            onChange={e => setNewMarque(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addMarque()}
            style={{ width: 200 }}
          />
          <button className="btn btn-primary" onClick={addMarque}>+ Ajouter</button>
        </div>
      </div>
    </div>
  )
}