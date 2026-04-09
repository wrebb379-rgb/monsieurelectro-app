import { useForm, ValidationError } from '@formspree/react'

export default function Formulaire() {
  const [state, handleSubmit] = useForm('meepboaz')

  const labelStyle = {
    display: 'block', fontSize: 12, fontWeight: 600, color: '#444',
    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6
  }
  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #ddd',
    borderRadius: 8, fontSize: 14, color: '#1a1a1a', background: '#fafafa',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
  }
  const selectStyle = {
    ...inputStyle,
    appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23555' d='M6 8L0 0h12z'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36
  }
  const sectionTitle = (txt) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: '#1565C0', textTransform: 'uppercase', letterSpacing: 1, margin: '24px 0 14px', paddingBottom: 6, borderBottom: '1.5px solid #BBDEFB' }}>
      {txt}
    </div>
  )

  if (state.succeeded) return (
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
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '0 0 32px', fontFamily: 'Segoe UI, sans-serif', background: '#fff' }}>

      {/* En-tête */}
      <div style={{ background: 'linear-gradient(135deg, #2E7D32, #1565C0)', padding: '24px 28px 20px', marginBottom: 28 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>Demande de réparation</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>Monsieur Électro Services Inc. — Région de Québec</p>
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* Tarifs */}
        <div style={{ background: '#E8F5E9', borderLeft: '3px solid #2E7D32', padding: '10px 14px', borderRadius: '0 8px 8px 0', fontSize: 12, color: '#1B5E20', marginBottom: 20, lineHeight: 1.7 }}>
          <strong>Tarifs :</strong> Déplacement / diagnostic 89,95 $ · Réparation 80 $ supplémentaire<br />
          Paiement : débit, chèque, virement Interac, argent comptant · Garantie 90 jours pièces et main-d'œuvre
        </div>

        <form onSubmit={handleSubmit}>

          {sectionTitle('Vos coordonnées')}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Prénom <span style={{ color: '#2E7D32' }}>*</span></label>
              <input type="text" name="prenom" placeholder="Frédéric" required style={inputStyle} />
              <ValidationError field="prenom" errors={state.errors} />
            </div>
            <div>
              <label style={labelStyle}>Nom <span style={{ color: '#2E7D32' }}>*</span></label>
              <input type="text" name="nom" placeholder="Wagner" required style={inputStyle} />
              <ValidationError field="nom" errors={state.errors} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Téléphone <span style={{ color: '#2E7D32' }}>*</span></label>
              <input type="tel" name="tel" placeholder="418 622-3651" required style={inputStyle} />
              <ValidationError field="tel" errors={state.errors} />
            </div>
            <div>
              <label style={labelStyle}>Courriel <span style={{ color: '#2E7D32' }}>*</span></label>
              <input type="email" name="email" placeholder="vous@exemple.com" required style={inputStyle} />
              <ValidationError field="email" errors={state.errors} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Adresse</label>
              <input type="text" name="adresse" placeholder="9340 rue de Belfort" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Ville <span style={{ color: '#2E7D32' }}>*</span></label>
              <select name="ville" required style={selectStyle}>
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
              </select>
              <ValidationError field="ville" errors={state.errors} />
            </div>
          </div>

          {sectionTitle('Votre appareil')}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Marque <span style={{ color: '#2E7D32' }}>*</span></label>
              <select name="marque" required style={selectStyle}>
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
              </select>
              <ValidationError field="marque" errors={state.errors} />
            </div>
            <div>
              <label style={labelStyle}>Type d'appareil <span style={{ color: '#2E7D32' }}>*</span></label>
              <select name="appareil" required style={selectStyle}>
                <option value="">-- Choisir --</option>
                <option>Laveuse</option>
                <option>Sécheuse</option>
                <option>Réfrigérateur</option>
                <option>Congélateur</option>
                <option>Lave-vaisselle</option>
                <option>Cuisinière</option>
              </select>
              <ValidationError field="appareil" errors={state.errors} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Numéro de modèle <span style={{ fontWeight: 400, color: '#aaa', textTransform: 'none' }}>(si disponible)</span></label>
            <input type="text" name="modele" placeholder="ex: WA50R5200AW" style={inputStyle} />
          </div>

          {sectionTitle('Description du problème')}

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Décrivez le problème <span style={{ color: '#2E7D32' }}>*</span></label>
            <textarea
              name="description" required
              placeholder="Ex: La laveuse cogne et vibre beaucoup en essorage..."
              style={{ ...inputStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.5 }}
            />
            <ValidationError field="description" errors={state.errors} />
          </div>

          {/* Upload photo/vidéo */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Photo ou vidéo <span style={{ fontWeight: 400, color: '#aaa', textTransform: 'none' }}>(optionnel)</span></label>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 14px', border: '2px dashed #BBDEFB', borderRadius: 8, background: '#F8FBFF', cursor: 'pointer', textAlign: 'center', gap: 8 }}>
              <span style={{ fontSize: 28 }}>📎</span>
              <span style={{ fontSize: 13, color: '#1565C0', fontWeight: 600 }}>Cliquez pour ajouter une photo ou vidéo</span>
              <span style={{ fontSize: 11, color: '#999' }}>JPG, PNG, MP4, MOV</span>
              <input type="file" name="fichier" accept="image/*,video/*" multiple style={{ display: 'none' }} />
            </label>
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            style={{ width: '100%', padding: 14, background: state.submitting ? '#aaa' : '#2E7D32', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: state.submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
          >
            {state.submitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
          </button>

        </form>
      </div>
    </div>
  )
}