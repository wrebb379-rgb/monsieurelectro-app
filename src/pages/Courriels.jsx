import { useState } from 'react'
import { classifier } from '../utils/classifier'
import { parseGoDaddy } from '../utils/parseGoDaddy'
import { reglesDefaut } from '../data/regles'
import { regionsDefaut } from '../data/regions'
import { phrasesDefaut } from '../data/phrases'

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

  const badgeStyle = (code) => ({
    fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
    background: code==='green' ? '#E8F5E9' : code==='yellow' ? '#FFF8E1' : '#FFEBEE',
    color: code==='green' ? '#2E7D32' : code==='yellow' ? '#E65100' : '#C62828',
  })

  return (
    <div>

      {/* Titre + bouton simulateur */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:'#1a1a1a' }}>Courriels clients</h2>
        <button
          onClick={() => setShowSim(!showSim)}
          style={{ fontSize:13, fontWeight:600, padding:'9px 18px', borderRadius:8, border:'2px solid #E8A800', background: showSim ? '#E8A800' : '#fff', color: showSim ? '#fff' : '#E8A800', cursor:'pointer' }}>
          {showSim ? '✕ Fermer le simulateur' : '🧪 Tester un courriel GoDaddy'}
        </button>
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
              <span style={badgeStyle(simResult.cl.code)}>{simResult.cl.label}</span>
              <span style={{ marginLeft:10, fontWeight:700 }}>{simResult.nom}</span>
              <span style={{ color:'#666' }}> — {simResult.marque} {simResult.appareil} — {simResult.ville}</span>
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

        {/* Sidebar — liste des courriels */}
        <div style={{ width:260, flexShrink:0, display:'flex', flexDirection:'column', gap:8 }}>
          {emailsDemo.map(e => {
            const c = classifier(e, regles, regions)
            const isActive = e.id === activeId
            return (
              <div key={e.id}
                onClick={() => { setActiveId(e.id); setPreview(null) }}
                style={{
                  background: isActive ? '#fff' : '#fff',
                  border: isActive ? '2px solid #E8A800' : '2px solid transparent',
                  borderRadius: 10,
                  padding: '12px 14px',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 12px rgba(232,168,0,0.2)' : '0 1px 4px rgba(0,0,0,0.08)',
                  transition: 'all 0.15s',
                }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <span style={badgeStyle(c.code)}>{c.label}</span>
                  {e.pieceJointe.length > 0 && <span style={{ fontSize:13 }}>📎</span>}
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:'#1a1a1a', marginBottom:3 }}>
                  {e.prenom} {e.nom.split(' ').slice(-1)[0]}
                </div>
                <div style={{ fontSize:12, color:'#666' }}>{e.marque} · {e.appareil}</div>
                <div style={{ fontSize:11, color:'#aaa', marginTop:2 }}>{e.ville} · {e.time}</div>
              </div>
            )
          })}
        </div>

        {/* Panel principal */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>

          {/* Entête client */}
          <div style={{ background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ background:'#E8A800', padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:4 }}>
                  {email.prenom} {email.nom}
                </div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.85)', display:'flex', gap:16, flexWrap:'wrap' }}>
                  <span>📧 {email.email}</span>
                  <span>📞 {email.tel}</span>
                  <span>📍 {email.ville}</span>
                  <span>🕐 {email.time}</span>
                </div>
              </div>
              <span style={{ ...badgeStyle(cl.code), fontSize:13, padding:'6px 16px', background:'rgba(255,255,255,0.25)', color:'#fff', border:'2px solid rgba(255,255,255,0.5)' }}>
                {cl.label}
              </span>
            </div>

            {/* Infos appareil */}
            <div style={{ padding:'14px 20px', borderBottom:'1px solid #F5F5F5', display:'flex', gap:10, flexWrap:'wrap' }}>
              {[['🔧 Marque', email.marque], ['🏠 Appareil', email.appareil], ['📍 Ville', email.ville], ['📞 Tél', email.tel]].map(([k,v]) => (
                <div key={k} style={{ background:'#F5F5F5', borderRadius:8, padding:'6px 12px' }}>
                  <div style={{ fontSize:10, color:'#999', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{k}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#1a1a1a' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ padding:'14px 20px' }}>
              <div style={{ fontSize:11, color:'#aaa', fontWeight:600, marginBottom:4, textTransform:'uppercase', letterSpacing:'0.5px' }}>
                Modèle : {email.marqueRaw}
              </div>
              <div style={{ fontSize:14, color:'#333', lineHeight:1.7 }}>
                {email.description}
              </div>

              {/* Pièces jointes */}
              {email.pieceJointe.map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:12, marginTop:10, padding:'10px 14px', background:'#F9F9F9', borderRadius:8, border:'1px solid #E0E0E0' }}>
                  <span style={{ fontSize:24 }}>{fileIcon(f)}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700 }}>{f}</div>
                    <div style={{ fontSize:11, color:'#aaa' }}>Pièce jointe</div>
                  </div>
                </div>
              ))}

              {/* Analyse */}
              <div style={{
                marginTop:12, padding:'10px 14px', borderRadius:8, fontSize:13, fontWeight:500,
                background: cl.code==='green' ? '#E8F5E9' : cl.code==='yellow' ? '#FFF8E1' : '#FFEBEE',
                color: cl.code==='green' ? '#2E7D32' : cl.code==='yellow' ? '#E65100' : '#C62828',
                borderLeft: `4px solid ${cl.code==='green' ? '#2E7D32' : cl.code==='yellow' ? '#E65100' : '#C62828'}`,
              }}>
                {cl.code==='green' ? '✅' : cl.code==='yellow' ? '⚠️' : '❌'} {cl.reason}
              </div>
            </div>
          </div>

          {/* Zone de réponse */}
          <div style={{ background:'#fff', borderRadius:12, padding:'16px 20px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>

            {/* Suggéré */}
            <div style={{ marginBottom:14, paddingBottom:14, borderBottom:'1px solid #F5F5F5' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#E8A800', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>
                ★ Suggéré par tes règles
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {cl.code==='green' && <button className="btn btn-primary" onClick={() => handlePreview('prendre')}>✓ Confirmer le RDV</button>}
                {cl.code==='yellow' && <button className="btn btn-primary" onClick={() => handlePreview('prendre')}>✓ Je prends le dossier</button>}
                {cl.code==='red' && cl.phraseKey==='secteur' && <button className="btn btn-danger" onClick={() => handlePreview('secteur')}>✓ Hors secteur</button>}
                {cl.code==='red' && cl.phraseKey==='appareil' && <button className="btn btn-danger" onClick={() => handlePreview('appareil')}>✓ Appareil non réparé</button>}
                {cl.code==='red' && cl.phraseKey==='marque' && <button className="btn btn-danger" onClick={() => handlePreview('marque')}>✓ Marque non couverte</button>}
              </div>
            </div>

            {/* Toutes les réponses */}
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'#999', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>
                Toutes les réponses disponibles
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <button className="btn btn-primary" onClick={() => handlePreview('prendre')}>Je prends le dossier</button>
                <button className="btn" onClick={() => handlePreview('info')}>Demander plus d'info</button>
                <button className="btn btn-danger" onClick={() => handlePreview('secteur')}>Hors secteur</button>
                <button className="btn btn-danger" onClick={() => handlePreview('marque')}>Marque non couverte</button>
                <button className="btn btn-danger" onClick={() => handlePreview('appareil')}>Appareil non réparé</button>
              </div>
            </div>

            {/* Aperçu de la réponse */}
            {preview && (
              <div style={{ marginTop:16, borderTop:'1px solid #F5F5F5', paddingTop:16 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#999', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>
                  Aperçu du message
                </div>
                <div style={{ fontSize:13, whiteSpace:'pre-wrap', lineHeight:1.8, background:'#F9F9F9', padding:'14px 16px', borderRadius:8, border:'1px solid #E0E0E0', color:'#333' }}>
                  {preview.text}
                </div>
                <div style={{ display:'flex', gap:10, marginTop:12 }}>
                  <button className="btn btn-primary" onClick={() => alert('Envoie à ' + email.email)}>
                    📤 Envoyer à {email.email}
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