import { useState } from 'react'
import { classifier } from '../utils/classifier'
import { parseGoDaddy } from '../utils/parseGoDaddy'
import { reglesDefaut } from '../data/regles'
import { regionsDefaut } from '../data/regions'
import { phrasesDefaut } from '../data/phrases'

const emailsDemo = [
  {
    id: 1, prenom: 'Josée', nom: 'Rhéaume',
    adresse: '537 rue Myriam', ville: 'Québec', cp: 'G1L',
    tel: '418-208-4216', email: 'rheaume.josee@gmail.com',
    marque: 'Frigidaire', appareil: 'Lave-vaisselle',
    marqueRaw: 'Lave-vaisselle Frigidaire modèle Gallery',
    description: 'Message d\'erreur « Er ». Ne fonctionne plus depuis que le message s\'affiche.',
    pieceJointe: ['image.jpg'], time: '14h22'
  },
  {
    id: 2, prenom: 'François', nom: 'Gagnon',
    adresse: '122 boul. Lebourgneuf', ville: 'Charlesbourg', cp: 'G2K',
    tel: '418-555-1234', email: 'fgagnon@hotmail.com',
    marque: 'Samsung', appareil: 'Sécheuse',
    marqueRaw: 'Samsung sécheuse DV45T',
    description: 'Bruit de cliquetis depuis 3 jours. Sèche encore.',
    pieceJointe: [], time: '13h05'
  },
  {
    id: 3, prenom: 'Lucie', nom: 'Côté',
    adresse: '45 rue du Roi', ville: 'Limoilou', cp: 'G1L',
    tel: '418-555-9999', email: 'lucie.cote@gmail.com',
    marque: 'LG', appareil: 'Micro-ondes',
    marqueRaw: 'LG micro-ondes LMV2031ST',
    description: 'Ne s\'allume plus du tout depuis ce matin.',
    pieceJointe: ['video.mp4'], time: '11h30'
  },
  {
    id: 4, prenom: 'Pierre', nom: 'Bouchard',
    adresse: '890 ch. Sainte-Foy', ville: 'Sainte-Foy', cp: 'G1V',
    tel: '418-555-3333', email: 'pbouchard@videotron.ca',
    marque: 'LG', appareil: 'Laveuse',
    marqueRaw: 'LG laveuse frontale WM3400CW',
    description: 'Fuite par en bas depuis 2 jours.',
    pieceJointe: ['fuite.jpg'], time: '09h15'
  },
  {
    id: 5, prenom: 'Diane', nom: 'Roberge',
    adresse: '22 rue Commerciale', ville: 'Lévis', cp: 'G6V',
    tel: '418-555-7777', email: 'droberge@gmail.com',
    marque: 'Samsung', appareil: 'Laveuse',
    marqueRaw: 'Samsung laveuse top load WA50R',
    description: 'Ne spin plus du tout.',
    pieceJointe: [], time: '08h40'
  },
]

function fileIcon(name) {
  const ext = name.split('.').pop().toLowerCase()
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) return '🖼'
  if (['mp4','mov','avi','webm'].includes(ext)) return '🎥'
  return '📎'
}

function fillPrenom(txt, prenom) {
  return txt.replace(/\{prenom\}/g, prenom || '')
}

export default function Courriels() {
  const [activeId, setActiveId] = useState(1)
  const [preview, setPreview] = useState(null)
  const [rawEmail, setRawEmail] = useState('')
  const [simResult, setSimResult] = useState(null)
  const [showSim, setShowSim] = useState(false)

  const regles = reglesDefaut
  const regions = regionsDefaut
  const phrases = phrasesDefaut

  const email = emailsDemo.find(e => e.id === activeId)
  const cl = classifier(email, regles, regions)

  function handlePreview(key) {
    setPreview({ key, text: fillPrenom(phrases[key], email.prenom) })
  }

  function simulate() {
    const parsed = parseGoDaddy(rawEmail, regles)
    const cl2 = classifier(parsed, regles, regions)
    setSimResult({ ...parsed, cl: cl2, phrase: fillPrenom(phrases[cl2.phraseKey], parsed.prenom) })
  }

  const badgeClass = (code) =>
    code === 'green' ? 'badge badge-green' :
    code === 'yellow' ? 'badge badge-yellow' : 'badge badge-red'

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>Courriels clients</h2>
        <button className="btn" onClick={() => setShowSim(!showSim)}>
          {showSim ? 'Masquer le simulateur' : '🧪 Tester un courriel GoDaddy'}
        </button>
      </div>

      {showSim && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title">Colle un courriel GoDaddy pour l'analyser</div>
          <textarea
            style={{ width: '100%', height: 120, marginBottom: 8 }}
            placeholder="Colle le texte brut du courriel ici..."
            value={rawEmail}
            onChange={e => setRawEmail(e.target.value)}
          />
          <button className="btn btn-primary" onClick={simulate}>Analyser</button>
          {simResult && (
            <div style={{ marginTop: 12, padding: 12, background: '#f9f9f9', borderRadius: 8, fontSize: 12 }}>
              <span className={badgeClass(simResult.cl.code)} style={{ marginRight: 8 }}>{simResult.cl.label}</span>
              <strong>{simResult.nom}</strong> — {simResult.marque} {simResult.appareil} — {simResult.ville}<br />
              <div style={{ marginTop: 6, color: '#666' }}>{simResult.cl.reason}</div>
              <div style={{ marginTop: 8, whiteSpace: 'pre-wrap', background: '#fff', padding: 10, borderRadius: 6, border: '1px solid #eee' }}>
                {simResult.phrase}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 0, border: '1px solid #e0e0e0', borderRadius: 10, overflow: 'hidden', minHeight: 500 }}>
        {/* Sidebar */}
        <div style={{ width: 240, borderRight: '1px solid #e0e0e0', overflowY: 'auto' }}>
          {emailsDemo.map(e => {
            const c = classifier(e, regles, regions)
            return (
              <div
                key={e.id}
                onClick={() => { setActiveId(e.id); setPreview(null) }}
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  background: e.id === activeId ? '#f0faf5' : '#fff',
                  borderLeft: e.id === activeId ? '3px solid #1D9E75' : '3px solid transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span className={badgeClass(c.code)}>{c.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.prenom} {e.nom.split(' ').slice(-1)[0]}
                  </span>
                  {e.pieceJointe.length > 0 && <span style={{ fontSize: 12 }}>📎</span>}
                </div>
                <div style={{ fontSize: 11, color: '#888' }}>{e.marque} · {e.appareil}</div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{e.ville} · {e.time}</div>
              </div>
            )
          })}
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{email.prenom} {email.nom} — {email.appareil} {email.marque}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{email.email} · {email.tel} · {email.ville} · {email.time}</div>
            </div>
            <span className={badgeClass(cl.code)}>{cl.label}</span>
          </div>

          {/* Body */}
          <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {[['Marque', email.marque], ['Appareil', email.appareil], ['Ville', email.ville], ['Tél', email.tel]].map(([k, v]) => (
                <span key={k} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#f5f5f5', border: '1px solid #e0e0e0', color: '#555' }}>
                  {k}: {v}
                </span>
              ))}
            </div>

            <div style={{ fontSize: 12, color: '#444', lineHeight: 1.7, background: '#f9f9f9', padding: '10px 14px', borderRadius: 8, marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>Modèle: {email.marqueRaw}</div>
              {email.description}
            </div>

            {email.pieceJointe.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f9f9f9', borderRadius: 8, border: '1px solid #e0e0e0', marginBottom: 6, fontSize: 12 }}>
                <span style={{ fontSize: 20 }}>{fileIcon(f)}</span>
                <div>
                  <div style={{ fontWeight: 500 }}>{f}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>Pièce jointe</div>
                </div>
              </div>
            ))}

            <div style={{
              padding: '8px 12px', borderRadius: 8, fontSize: 12, marginTop: 8,
              background: cl.code === 'green' ? '#E1F5EE' : cl.code === 'yellow' ? '#FAEEDA' : '#FCEBEB',
              color: cl.code === 'green' ? '#0F6E56' : cl.code === 'yellow' ? '#854F0B' : '#A32D2D',
              border: `1px solid ${cl.code === 'green' ? '#9FE1CB' : cl.code === 'yellow' ? '#FAC775' : '#F7C1C1'}`,
            }}>
              {cl.reason}
            </div>
          </div>

          {/* Reply area */}
          <div style={{ borderTop: '1px solid #f0f0f0', padding: '12px 16px' }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 8 }}>Réponse guidée par tes règles :</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {cl.code === 'green' && <>
                <button className="btn btn-primary" onClick={() => handlePreview('prendre')}>Confirmer RDV</button>
                <button className="btn" onClick={() => handlePreview('info')}>Demander info</button>
              </>}
              {cl.code === 'yellow' && <>
                <button className="btn btn-primary" onClick={() => handlePreview('prendre')}>Je prends le dossier</button>
                <button className="btn" onClick={() => handlePreview('info')}>Demander info</button>
                <button className="btn btn-danger" onClick={() => handlePreview('marque')}>Marque non couverte</button>
              </>}
              {cl.code === 'red' && <>
                <button className="btn btn-danger" onClick={() => handlePreview(cl.phraseKey)}>{cl.label}</button>
                <button className="btn" onClick={() => handlePreview('info')}>Demander info</button>
              </>}
            </div>
            {preview && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 12, whiteSpace: 'pre-wrap', lineHeight: 1.7, background: '#f9f9f9', padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e0e0', color: '#555' }}>
                  {preview.text}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="btn btn-primary" onClick={() => alert('Dans la vraie app: envoie à ' + email.email)}>
                    Envoyer à {email.email}
                  </button>
                  <button className="btn" onClick={() => setPreview(null)}>Annuler</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}