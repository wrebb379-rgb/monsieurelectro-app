import { useState, useEffect } from 'react'

const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const JOURS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']

const eventsReels = {
  '2026-04-07': 8, '2026-04-08': 5, '2026-04-09': 6,
  '2026-04-10': 3, '2026-04-13': 3, '2026-04-15': 1,
  '2026-04-24': 1,
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function formatFr(d) {
  if (!d) return '—'
  const j = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi']
  return `${j[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()].toLowerCase()} ${d.getFullYear()}`
}

export default function Calendrier() {
  const today = new Date(2026, 3, 7)
  const [viewDate, setViewDate] = useState(new Date(today))
  const [maxRdv, setMaxRdv] = useState(6)
  const [blocked, setBlocked] = useState(new Set())
  const [vue, setVue] = useState('mois')

  function getCount(dk) { return eventsReels[dk] || 0 }

  function findNext() {
    const d = new Date(today)
    for (let i = 0; i < 60; i++) {
      const dk = dateKey(d)
      if (d.getDay() !== 0 && !blocked.has(dk) && getCount(dk) < maxRdv) return new Date(d)
      d.setDate(d.getDate() + 1)
    }
    return null
  }

  const nextDispo = findNext()

  function toggleBlock(dk, date) {
    if (date < today) return
    const b = new Set(blocked)
    b.has(dk) ? b.delete(dk) : b.add(dk)
    setBlocked(b)
  }

  function renderMois() {
    const y = viewDate.getFullYear(), m = viewDate.getMonth()
    const first = new Date(y, m, 1)
    const startDow = first.getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const nextKey = nextDispo ? dateKey(nextDispo) : null
    const cells = []

    for (let i = 0; i < startDow; i++) {
      cells.push(<div key={`p${i}`} style={{ minHeight: 80, background: '#fafafa', border: '1px solid #f0f0f0' }} />)
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d)
      const dk = dateKey(date)
      const dow = date.getDay()
      const isSun = dow === 0
      const isToday = dk === dateKey(today)
      const isBlocked = blocked.has(dk)
      const isNext = dk === nextKey
      const cnt = getCount(dk)
      const remaining = maxRdv - cnt
      const isFull = cnt >= maxRdv
      const isPast = date < today

      let bg = '#fff'
      if (isNext) bg = '#E1F5EE'
      else if (isSun || isBlocked) bg = '#FFF3CD'
      else if (isFull) bg = '#fff5f5'
      else if (cnt > 0) bg = '#f0faf5'

      const barPct = Math.min(100, Math.round((cnt / maxRdv) * 100))
      const barColor = isFull ? '#E24B4A' : cnt > maxRdv * 0.6 ? '#EF9F27' : '#1D9E75'

      cells.push(
        <div
          key={dk}
          onClick={() => !isSun && !isPast && toggleBlock(dk, date)}
          style={{ minHeight: 80, border: '1px solid #f0f0f0', padding: 6, background: bg, cursor: (!isSun && !isPast) ? 'pointer' : 'default', outline: isNext ? '2px solid #1D9E75' : 'none', position: 'relative' }}
        >
          <div style={{
            fontSize: 12, fontWeight: 500, marginBottom: 3,
            ...(isToday ? { background: '#1D9E75', color: '#fff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 } : {})
          }}>{d}</div>

          {cnt > 0 && <div style={{ fontSize: 10, color: '#888', marginBottom: 2 }}>{cnt}/{maxRdv} RDV</div>}
          {cnt > 0 && <div style={{ height: 3, borderRadius: 2, background: barColor, width: `${barPct}%`, marginBottom: 3 }} />}

          {isNext && <div style={{ fontSize: 9, fontWeight: 600, color: '#0F6E56', background: '#9FE1CB', padding: '1px 5px', borderRadius: 3 }}>Prochain dispo</div>}
          {isFull && !isNext && <div style={{ fontSize: 9, color: '#A32D2D', background: '#F7C1C1', padding: '1px 5px', borderRadius: 3 }}>Complet</div>}
          {isBlocked && <div style={{ fontSize: 9, color: '#854F0B', background: '#FAC775', padding: '1px 5px', borderRadius: 3 }}>Bloqué</div>}
          {isSun && <div style={{ fontSize: 9, color: '#888', background: '#eee', padding: '1px 5px', borderRadius: 3 }}>Fermé</div>}
          {!isFull && !isBlocked && !isSun && cnt > 0 && !isNext && (
            <div style={{ fontSize: 9, color: '#0F6E56' }}>{remaining} libre{remaining > 1 ? 's' : ''}</div>
          )}
        </div>
      )
    }

    return cells
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Calendrier</h2>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className={`btn ${vue === 'mois' ? 'btn-primary' : ''}`} onClick={() => setVue('mois')}>Mois</button>
          <button className={`btn ${vue === 'semaine' ? 'btn-primary' : ''}`} onClick={() => setVue('semaine')}>Semaine</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <span style={{ fontSize: 12, color: '#888' }}>Max RDV/jour :</span>
          <input type="number" value={maxRdv} min={1} max={20} onChange={e => setMaxRdv(+e.target.value)} style={{ width: 60 }} />
          {nextDispo && (
            <span style={{ fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20, background: '#E1F5EE', color: '#0F6E56', border: '1px solid #9FE1CB' }}>
              Prochain : {formatFr(nextDispo)}
            </span>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button className="btn" onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth()-1); setViewDate(d) }}>‹</button>
          <span style={{ fontWeight: 500 }}>{MOIS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
          <button className="btn" onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth()+1); setViewDate(d) }}>›</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
          {JOURS.map(j => (
            <div key={j} style={{ textAlign: 'center', padding: '6px 4px', fontSize: 11, fontWeight: 500, color: '#888', background: '#f9f9f9', border: '1px solid #f0f0f0' }}>{j}</div>
          ))}
          {renderMois()}
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
          💡 Clique sur une journée pour la bloquer (vacances, maladie) ou la débloquer.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8, fontSize: 11, color: '#888' }}>
        {[['#E1F5EE','#9FE1CB','Prochain disponible'],['#f0faf5','#9FE1CB','Cases disponibles'],['#fff5f5','#F7C1C1','Complet'],['#FFF3CD','#FAC775','Bloqué/Fermé']].map(([bg,b,label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 12, height: 12, background: bg, border: `1px solid ${b}`, borderRadius: 2 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}