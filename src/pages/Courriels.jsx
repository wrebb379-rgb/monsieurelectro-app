import { useState } from 'react'
import { classifier } from '../utils/classifier'
import { parseGoDaddy } from '../utils/parseGoDaddy'
import { reglesDefaut } from '../data/regles'
import { regionsDefaut } from '../data/regions'
import { phrasesDefaut } from '../data/phrases'
import { useOutlook } from '../useOutlook'

const emailsDemo = [
  { id:1, prenom:'Josée', nom:'Rhéaume', adresse:'537 rue Myriam', ville:'Québec', cp:'G1L', tel:'418-208-4216', email:'rheaume.josee@gmail.com', marque:'Frigidaire', appareil:'Lave-vaisselle', marqueRaw:'Lave-vaisselle Frigidaire modèle Gallery', description:'Message d\'erreur « Er ». Ne fonctionne plus depuis que le message s\'affiche.', pieceJointe:['image.jpg'], time:'14h22' },
  { id:2, prenom:'François', nom:'Gagnon', adresse:'122 boul. Lebourgneuf', ville:'Charlesbourg', cp:'G2K', tel:'418-555-1234', email:'fgagnon@hotmail.com', marque:'Samsung', appareil:'Sécheuse', marqueRaw:'Samsung sécheuse DV45T', description:'Bruit de cliquetis depuis 3 jours.', pieceJointe:[], time:'13h05' },
  { id:3, prenom:'Lucie', nom:'Côté', adresse:'45 rue du Roi', ville:'Limoilou', cp:'G1L', tel:'418-555-9999', email:'lucie.cote@gmail.com', marque:'LG', appareil:'Micro-ondes', marqueRaw:'LG micro-ondes LMV2031ST', description:'Ne s\'allume plus du tout.', pieceJointe:['video.mp4'], time:'11h30' },
  { id:4, prenom:'Pierre', nom:'Bouchard', adresse:'890 ch. Sainte-Foy', ville:'Sainte-Foy', cp:'G1V', tel:'418-555-3333', email:'pbouchard@videotron.ca', marque:'LG', appareil:'Laveuse', marqueRaw:'LG laveuse frontale WM3400CW', description:'Fuite par en bas depuis 2 jours.', pieceJointe:['fuite.jpg'], time:'09h15' },
  { id:5, prenom:'Diane', nom:'Roberge', adresse:'22 rue Commerciale', ville:'Lévis', cp:'G6V', tel:'418-555-7777', email:'droberge@gmail.com', marque:'Samsung', appareil:'Laveuse', marqueRaw:'Samsung laveuse top load WA50R', description:'Ne spin plus du tout.', pieceJointe:[], time:'08h40' },
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
  const [activeId, setActiveId] = useState(null)
  const [preview, setPreview] = useState(null)
  const [rawEmail, setRawEmail] = useState('')
  const [simResult, setSimResult] = useState(null)
  const [showSim, setShowSim] = useState(false)
  const [search, setSearch] = useState('')
  const { account, courriels, loading, error, connecter, deconnecter } = useOutlook()

  const regles = reglesDefaut
  const regions = regionsDefaut
  const phrases = phrasesDefaut

  const emailsActifs = courriels.length > 0
    ? courriels.map((m) => {
       const body = m.bodyTexte || m.bodyPreview || ''
console.log('=== BODY BRUT ===', JSON.stringify(body.substring(0, 500)))
const parsed = parseGoDaddy(body, regles)
        return {
          id: m.id,
          prenom: parsed.prenom || 'Client',
          nom: parsed.nom || '',
          adresse: parsed.adresse || '',
          ville: parsed.ville || '',
          cp: parsed.cp || '',
          tel: parsed.tel || '',
          email: parsed.email || (m.from ? m.from.emailAddress.address : ''),
          marque: parsed.marque || '',
          appareil: parsed.appareil || '',
          marqueRaw: parsed.marqueRaw || m.subject || '',
          description: parsed.description || m.bodyPreview || '',
          pieceJointe: parsed.pieceJointe || [],
          time: new Date(m.receivedDateTime).toLocaleTimeString('fr-CA', { hour:'2-digit', minute:'2-digit' }),
        }
      })
    : emailsDemo

  const emailsFiltres = emailsActifs.filter(function(e) {
    const txt = (e.prenom + ' ' + e.nom + ' ' + e.marque + ' ' + e.appareil + ' ' + e.ville).toLowerCase()
    return txt.indexOf(search.toLowerCase()) !== -1
  })

  const activeEmail = emailsActifs.find(function(e) { return e.id === activeId }) || emailsActifs[0]
  const cl = activeEmail ? classifier(activeEmail, regles, regions) : { code:'yellow', label:'À vérifier', reason:'', phraseKey:'info' }

  function handlePreview(key) {
    if (!activeEmail) return
    setPreview({ key, text: fillPrenom(phrases[key], activeEmail.prenom) })
  }

  function simulate() {
    const parsed = parseGoDaddy(rawEmail, regles)
    const cl2 = classifier(parsed, regles, regions)
    setSimResult({ ...parsed, cl: cl2, phrase: fillPrenom(phrases[cl2.phraseKey], parsed.prenom) })
  }

  return (
    <div>
      {/* Titre + boutons */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
        <h2 style={{ fontSize:22, fontWeight:800 }}>Courriels clients</h2>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {!account ? (
            <button onClick={connecter} disabled={loading} style={{
              fontSize:13, fontWeight:600, padding:'9px 18px', borderRadius:8,
              border:'2px solid #0078D4', background:'#0078D4', color:'#fff', cursor:'pointer'
            }}>
              {loading ? 'Connexion...' : '📧 Connecter Outlook'}
            </button>
          ) : (
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:12, color:'#2E7D32', fontWeight:600 }}>✅ {account.username}</span>
              <button onClick={deconnecter} style={{
                fontSize:12, padding:'6px 12px', borderRadius:8,
                border:'1px solid #ddd', background:'#fff', cursor:'pointer'
              }}>Déconnecter</button>
            </div>
          )}
          {error && <span style={{ fontSize:12, color:'#C62828' }}>{error}</span>}
          <button onClick={() => setShowSim(!showSim)} style={{
            fontSize:13, fontWeight:600, padding:'9px 18px', borderRadius:8,
            border:'2px solid #E8A800', background: showSim ? '#E8A800' : '#fff',
            color: showSim ? '#fff' : '#E8A800', cursor:'pointer'
          }}>
            {showSim ? '✕ Fermer' : '🧪 Tester GoDaddy'}
          </button>
        </div>
      </div>

      {/* Simulateur */}
      {showSim && (
        <div className="card" style={{ marginBottom:20, borderLeft:'4px solid #E8A800' }}>
          <div className="card-title">Colle un courriel GoDaddy pour l'analyser</div>
          <textarea style={{ width:'100%', height:120, marginBottom:10, fontSize:12 }}
            placeholder="Colle le texte brut du courriel ici..."
            value={rawEmail} onChange={e => setRawEmail(e.target.value)} />
          <button className="btn btn-primary" onClick={simulate}>Analyser</button>
          {simResult && (
            <div style={{ marginTop:14, padding:14, background:'#F9F9F9', borderRadius:10, fontSize:12 }}>
              <span style={{
                fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20,
                background: simResult.cl.code === 'green' ? '#2E7D32' : '#C62828',
                color:'#fff', marginRight:8
              }}>{simResult.cl.label}</span>
              <strong>{simResult.nom}</strong> — {simResult.marque} {simResult.appareil} — {simResult.ville}
              <div style={{ marginTop:6, color:'#666' }}>{simResult.cl.reason}</div>
              <div style={{ marginTop:10, whiteSpace:'pre-wrap', background:'#fff', padding:12, borderRadius:8, border:'1px solid #E0E0E0', lineHeight:1.7 }}>
                {simResult.phrase}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Layout principal */}
      <div style={{ display:'flex', gap:16 }}>

        {/* Sidebar */}
        <div style={{ width:260, flexShrink:0, display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ background:'#fff', borderRadius:10, border:'1px solid #ddd', padding:'10px 12px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#666', marginBottom:8 }}>
              {loading ? 'Chargement...' : emailsFiltres.length + ' client' + (emailsFiltres.length > 1 ? 's' : '')}
            </div>
            <input type="text" placeholder="🔍 Rechercher..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width:'100%', fontSize:12, padding:'7px 10px', borderRadius:8, border:'1px solid #ddd' }}
            />
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:'70vh', overflowY:'auto' }}>
            {emailsFiltres.map(function(e) {
              const c = classifier(e, regles, regions)
              const isActive = e.id === (activeId || (emailsActifs[0] && emailsActifs[0].id))
              return (
                <div key={e.id}
                  onClick={() => { setActiveId(e.id); setPreview(null) }}
                  style={{
                    height:90, flexShrink:0, background:'#fff',
                    border: isActive ? '2px solid #E8A800' : '1px solid #ddd',
                    borderRadius:10, padding:'10px 14px', cursor:'pointer',
                    boxShadow: isActive ? '0 2px 12px rgba(232,168,0,0.2)' : '0 1px 4px rgba(0,0,0,0.06)',
                    transition:'all 0.15s', overflow:'hidden',
                  }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                    <span style={{
                      fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:20,
                      background: c.code === 'green' ? '#2E7D32' : c.code === 'yellow' ? '#E65100' : '#C62828',
                      color:'#fff'
                    }}>{c.label}</span>
                    {e.pieceJointe.length > 0 && <span style={{ fontSize:11 }}>📎</span>}
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#1a1a1a', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {e.prenom} {e.nom.split(' ').slice(-1)[0]}
                  </div>
                  <div style={{ fontSize:11, color:'#666', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {e.marque || '—'} · {e.appareil || '—'} · {e.ville || '—'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Séparateur */}
        <div style={{ width:3, background:'#E8A800', borderRadius:3, flexShrink:0 }} />

        {/* Panel principal */}
        {activeEmail && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>

            {/* Entête client */}
            <div style={{ background:'#fff', borderRadius:12, border:'1px solid #ddd', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', overflow:'hidden' }}>
              <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderLeft:'5px solid #E8A800' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                    <span style={{ fontSize:20, fontWeight:800, color:'#1a1a1a' }}>
                      {activeEmail.prenom} {activeEmail.nom}
                    </span>
                    <span style={{
                      fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20,
                      background: cl.code === 'green' ? '#2E7D32' : '#C62828', color:'#fff'
                    }}>{cl.label}</span>
                  </div>
                  <div style={{ fontSize:12, color:'#666', display:'flex', gap:14, flexWrap:'wrap' }}>
                    <span>📧 {activeEmail.email}</span>
                    <span>📞 {activeEmail.tel}</span>
                    <span>📍 {activeEmail.ville}</span>
                    <span>🕐 {activeEmail.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Infos appareil */}
            <div style={{ background:'#fff', borderRadius:12, border:'1px solid #ddd', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', padding:'14px 20px', display:'flex', gap:10, flexWrap:'wrap' }}>
              {[['🔧 Marque', activeEmail.marque || '—'], ['🏠 Appareil', activeEmail.appareil || '—'], ['📍 Ville', activeEmail.ville || '—'], ['📞 Tél', activeEmail.tel || '—']].map(function(item) {
                return (
                  <div key={item[0]} style={{ background:'#F5F5F5', borderRadius:8, padding:'6px 12px', border:'1px solid #E0E0E0' }}>
                    <div style={{ fontSize:10, color:'#999', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{item[0]}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#1a1a1a' }}>{item[1]}</div>
                  </div>
                )
              })}
            </div>

            {/* Description */}
            <div style={{ background:'#fff', borderRadius:12, border:'1px solid #ddd', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', height:220, overflowY:'auto', padding:'14px 20px' }}>
              <div style={{ fontSize:11, color:'#aaa', fontWeight:600, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>
                Modèle : {activeEmail.marqueRaw}
              </div>
              <div style={{ fontSize:14, color:'#333', lineHeight:1.7 }}>{activeEmail.description}</div>
              {activeEmail.pieceJointe.map(function(f) {
                return (
                  <div key={f} style={{ display:'flex', alignItems:'center', gap:12, marginTop:10, padding:'10px 14px', background:'#F9F9F9', borderRadius:8, border:'1px solid #E0E0E0' }}>
                    <span style={{ fontSize:24 }}>{fileIcon(f)}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700 }}>{f}</div>
                      <div style={{ fontSize:11, color:'#aaa' }}>Pièce jointe</div>
                    </div>
                  </div>
                )
              })}
              <div style={{
                marginTop:12, padding:'10px 14px', borderRadius:8, fontSize:13, fontWeight:500,
                background: cl.code === 'green' ? '#E8F5E9' : cl.code === 'yellow' ? '#FFF8E1' : '#FFEBEE',
                color: cl.code === 'green' ? '#2E7D32' : cl.code === 'yellow' ? '#E65100' : '#C62828',
                borderLeft: '4px solid ' + (cl.code === 'green' ? '#2E7D32' : cl.code === 'yellow' ? '#E65100' : '#C62828'),
              }}>
                {cl.code === 'green' ? '✅' : cl.code === 'yellow' ? '⚠️' : '❌'} {cl.reason}
              </div>
            </div>

            {/* Zone réponse */}
            <div style={{ background:'#fff', borderRadius:12, border:'1px solid #ddd', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', padding:'16px 20px' }}>
              <div style={{ marginBottom:14, paddingBottom:14, borderBottom:'1px solid #F5F5F5' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#E8A800', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>★ Suggéré par tes règles</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {cl.code === 'green' && <button className="btn btn-primary" onClick={() => handlePreview('prendre')}>✓ Confirmer le RDV</button>}
                  {cl.code === 'yellow' && <button className="btn btn-primary" onClick={() => handlePreview('prendre')}>✓ Je prends le dossier</button>}
                  {cl.code === 'red' && cl.phraseKey === 'secteur' && <button className="btn btn-danger" onClick={() => handlePreview('secteur')}>✓ Hors secteur</button>}
                  {cl.code === 'red' && cl.phraseKey === 'appareil' && <button className="btn btn-danger" onClick={() => handlePreview('appareil')}>✓ Appareil non réparé</button>}
                  {cl.code === 'red' && cl.phraseKey === 'marque' && <button className="btn btn-danger" onClick={() => handlePreview('marque')}>✓ Marque non couverte</button>}
                </div>
              </div>

              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#999', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Toutes les réponses disponibles</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <button className="btn btn-primary" onClick={() => handlePreview('prendre')}>Je prends le dossier</button>
                  <button className="btn" onClick={() => handlePreview('info')}>Demander plus d'info</button>
                  <button className="btn btn-danger" onClick={() => handlePreview('secteur')}>Hors secteur</button>
                  <button className="btn btn-danger" onClick={() => handlePreview('marque')}>Marque non couverte</button>
                  <button className="btn btn-danger" onClick={() => handlePreview('appareil')}>Appareil non réparé</button>
                </div>
              </div>

              {preview && (
                <div style={{ marginTop:16, borderTop:'1px solid #F5F5F5', paddingTop:16 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#999', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Aperçu du message</div>
                  <div style={{ fontSize:13, whiteSpace:'pre-wrap', lineHeight:1.8, background:'#F9F9F9', padding:'14px 16px', borderRadius:8, border:'1px solid #E0E0E0', color:'#333', marginBottom:12 }}>
                    {preview.text}
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    <button className="btn btn-primary" onClick={() => alert('Envoie à ' + activeEmail.email)}>📤 Envoyer à {activeEmail.email}</button>
                    <button className="btn" onClick={() => setPreview(null)}>Annuler</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}