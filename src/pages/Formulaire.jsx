import { useState } from 'react'

export default function Formulaire() {
  const [form, setForm] = useState({
    prenom: '', nom: '', tel: '', email: '',
    adresse: '', ville: '', marque: '', appareil: '', modele: '', description: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: false })
  }

  function validate() {
    const e = {}
    if (!form.prenom.trim()) e.prenom = true
    if (!form.nom.trim()) e.nom = true
    if (!form.tel.trim()) e.tel = true
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = true
    if (!form.ville) e.ville = true
    if (!form.marque) e.marque = true
    if (!form.appareil) e.appareil = true
    if (!form.description.trim()) e.description = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    const corps = `Monsieur Electro Services Inc. a reçu un nouveau message.
Nom ${form.prenom} ${form.nom}
Adresse complète ${form.adresse || 'Non fournie'}
Ville ${form.ville}
Votre téléphone ${form.tel}
Email ${form.email}
Marque et numéro de modèle de l'appareil ${form.marque} ${form.appareil} Modèle ${form.modele || 'non fourni'}
Description du problème. ${form.description}
Envoyé depuis Formulaire site web`

    try {
      const resp = await fetch('https://formspree.io/f/meepboaz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          message: corps,
          _replyto: form.email,
          _subject: 'Nouvelle demande - ' + form.marque + ' ' + form.appareil + ' - ' + form.prenom + ' ' + form.nom
        })
      })
      if (resp.ok) {
        setSuccess(true)
      } else {
        alert('Erreur lors de l\'envoi. Réessayez ou appelez-nous au 418 454-3119.')
      }
    } catch {
      alert('Erreur réseau. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  const inp = (name, placeholder, type = 'text', autocomplete = '') => ({
    name, type, placeholder, autoComplete: autocomplete,
    value: form[name], onChange: change,
    style: {
      width: '100%', padding: '11px 14px',
      border: errors[name] ? '1.5px solid #C62828' : '1.5px solid #ddd',
      borderRadius: 8, fontSize: 14, color: '#1a1a1a',
      background: '#fafafa', outline: 'none', fontFamily: 'inherit',
      boxSizing: 'border-box'
    }
  })

  const sel = (name) => ({
    name, value: form[name], onChange: change,
    style: {
      width: '100%', padding: '11px 14px',
      border: errors[name] ? '1.5px solid #C62828' : '1.5px solid #ddd',
      borderRadius: 8, fontSize: 14, color: form[name] ? '#1a1a1a' : '#999',
      background: '#fafafa', outline: 'none', fontFamily: 'inherit',
      appearance: 'none', WebkitAppearance: 'none', boxSizing: 'border-box',
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23555' d='M6 8L0 0h12z'/%3E%3C/svg%3E\")",
      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36
    }
  })

  const label = (txt, required = false) => (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
      {txt} {required && <span style={{ color: '#2E7D32' }}>*</span>}
    </label>
  )

  const field = (children, name) => (
    <div style={{ marginBottom: 16 }}>
      {children}
      {errors[name] && <div style={{ fontSize: 11, color: '#C62828', marginTop: 4 }}>Champ requis</div>}
    </div>
  )

  const sectionTitle = (txt) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: '#1565C0', textTransform: 'uppercase', letterSpacing: 1, margin: '24px 0 14px', paddingBottom: 6, borderBottom: '1.5px solid #BBDEFB' }}>
      {txt}
    </div>
  )

  if (success) return (
    <div style={{ maxWidth: 580, margin: '40px auto', padding: '0 16px', fontFamily: 'Segoe UI, sans-serif', textAlign: 'center' }}>
      <div style={{ background: '#E8F5E9', border: '1.5px solid #81C784', borderRadius: 12, padding: '36px 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <h3 style={{ color: '#2E7D32', fontSize: 20, marginBottom: 8 }}>Demande envoyée!</h3>
        <p style={{ color: '#388E3C', fontSize: 14, lineHeight: 1.7 }}>
          Nous vous répondrons dans les plus brefs délais.<br />
          Merci de votre confiance!
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '0 16px 32px', fontFamily: 'Segoe UI, sans-serif', background: '#fff' }}>

      {/* En-tête */}
      <div style={{ background: 'linear-gradient(135deg, #2E7D32, #1565C0)', padding: '24px 28px 20px', margin: '0 -16px 28px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>Demande de réparation</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>Monsieur Électro Services Inc. — Région de Québec</p>
      </div>

      {/* Tarifs */}
      <div style={{ background: '#E8F5E9', borderLeft: '3px solid #2E7D32', padding: '10px 14px', borderRadius: '0 8px 8px 0', fontSize: 12, color: '#1B5E20', marginBottom: 20, lineHeight: 1.7 }}>
        <strong>Tarifs :</strong> Déplacement / diagnostic 89,95 $ · Réparation 80 $ supplémentaire<br />
        Paiement : débit, chèque, virement Interac, argent comptant · Garantie 90 jours pièces et main-d'œuvre
      </div>

      <form onSubmit={submit} noValidate>

        {sectionTitle('Vos coordonnées')}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {field(<>{label('Prénom', true)}<input {...inp('prenom', 'Frédéric', 'text', 'given-name')} /></>, 'prenom')}
          {field(<>{label('Nom', true)}<input {...inp('nom', 'Wagner', 'text', 'family-name')} /></>, 'nom')}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {field(<>{label('Téléphone', true)}<input {...inp('tel', '418 622-3651', 'tel', 'tel')} /></>, 'tel')}
          {field(<>{label('Courriel', true)}<input {...inp('email', 'vous@exemple.com', 'email', 'email')} />{errors.email && <div style={{ fontSize: 11, color: '#C62828', marginTop: 4 }}>Courriel invalide</div>}</>, 'email')}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ marginBottom: 16 }}>
            {label('Adresse')}
            <input {...inp('adresse', '9340 rue de Belfort', 'text', 'street-address')} />
          </div>
          {field(
            <>{label('Ville', true)}
            <select {...sel('ville')}>
              <option value="">-- Choisir --</option>
              <option>Québec</option>
              <option>Beauport</option>
              <option>Charlesbourg</option>
              <option>Limoilou</option>
              <option>Sainte-Foy</option>
              <option>Sillery</option>
              <option>Wendake</option>
              <option>Loretteville</option>
              <option>Autre</option>
            </select></>,
            'ville'
          )}
        </div>

        {sectionTitle('Votre appareil')}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {field(
            <>{label('Marque', true)}
            <select {...sel('marque')}>
              <option value="">-- Choisir --</option>
              <option>Whirlpool</option>
              <option>Maytag</option>
              <option>Frigidaire</option>
              <option>Électrolux</option>
              <option>Amana</option>
              <option>Kenmore</option>
              <option>Bosch</option>
              <option>Speed Queen</option>
              <option>Samsung</option>
              <option>LG</option>
              <option>GE</option>
              <option>Inglis</option>
              <option>Autre</option>
            </select></>,
            'marque'
          )}
          {field(
            <>{label("Type d'appareil", true)}
            <select {...sel('appareil')}>
              <option value="">-- Choisir --</option>
              <option>Laveuse</option>
              <option>Sécheuse</option>
              <option>Réfrigérateur</option>
              <option>Congélateur</option>
              <option>Lave-vaisselle</option>
              <option>Cuisinière</option>
              <option>Micro-ondes</option>
            </select></>,
            'appareil'
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          {label('Numéro de modèle')}
          <input {...inp('modele', 'ex: WA50R5200AW')} />
        </div>

        {sectionTitle('Description du problème')}

        {field(
          <>{label('Décrivez le problème', true)}
          <textarea
            name="description" value={form.description} onChange={change}
            placeholder="Ex: La laveuse cogne et vibre beaucoup en essorage..."
            style={{ width: '100%', padding: '11px 14px', border: errors.description ? '1.5px solid #C62828' : '1.5px solid #ddd', borderRadius: 8, fontSize: 14, color: '#1a1a1a', background: '#fafafa', outline: 'none', fontFamily: 'inherit', minHeight: 100, resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box' }}
          /></>,
          'description'
        )}

        <button
          type="submit" disabled={loading}
          style={{ width: '100%', padding: 14, background: loading ? '#aaa' : '#2E7D32', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: '0.3px' }}
        >
          {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </button>

      </form>
    </div>
  )
}
