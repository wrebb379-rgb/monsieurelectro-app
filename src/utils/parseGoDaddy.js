export function parseGoDaddy(raw, regles = []) {
  if (!raw) return vide(regles)

  const text = raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')

  function extraire(label) {
    const patterns = [
      new RegExp(label + '\\s*\\n([^\\n]{1,200})', 'i'),
      new RegExp(label + '[:\\s]+([^\\n]{1,200})', 'i'),
    ]
    for (const re of patterns) {
      const m = text.match(re)
      if (m) return m[1].trim()
    }
    return ''
  }

  function extraireBloc(labelDebut, labelsFin) {
    const reDebut = new RegExp(labelDebut + '[^\\n]*\\n([\\s\\S]{1,500})', 'i')
    const m = text.match(reDebut)
    if (!m) return ''
    let bloc = m[1]
    for (const fin of labelsFin) {
      const idx = bloc.search(new RegExp(fin, 'i'))
      if (idx > 0) bloc = bloc.substring(0, idx)
    }
    return bloc.trim()
  }

  const nom = extraire('Nom') || ''
  const prenom = nom.split(' ')[0] || 'Client'
  const adresse = extraire('Adresse complète') || extraire('Adresse') || ''
  const ville = extraire('Ville') || ''
  const tel = extraire('téléphone') || extraire('Téléphone') || extraire('phone') || ''
  const email = extraire('Email') || extraire('Courriel') || ''

  const marqueRaw = extraire('Marque et numéro de modèle') ||
                    extraire('Marque et modèle') ||
                    extraire('Marque') || ''

  const description = extraireBloc(
    'Description du problème',
    ['Pièces jointes', 'Périphérique', 'Langue', 'Envoyé', 'Device']
  )

  const pieceJointe = (() => {
    const re = /\b(\w[\w.-]+\.(jpg|jpeg|png|gif|mp4|mov|avi|webm|pdf))\b/gi
    return [...raw.matchAll(re)].map(m => m[0])
  })()

  const cp = adresse.match(/[GHJ]\d[A-Z]\s?\d[A-Z]\d/i)?.[0]?.substring(0,3).toUpperCase() ||
             ville.match(/[GHJ]\d[A-Z]/i)?.[0]?.toUpperCase() || ''

  const marque = detectMarque(marqueRaw + ' ' + description, regles)
  const appareil = detectAppareil(marqueRaw + ' ' + description)

  return { nom, prenom, adresse, ville, cp, tel, email, marqueRaw, marque, appareil, description, pieceJointe }
}

function vide(regles) {
  return { nom:'', prenom:'Client', adresse:'', ville:'', cp:'', tel:'', email:'', marqueRaw:'', marque:'', appareil:'', description:'', pieceJointe:[] }
}

function detectMarque(txt, regles) {
  const t = txt.toLowerCase()
  for (const r of regles) {
    if (t.includes(r.m.toLowerCase())) return r.m
  }
  const synonymes = {
    frigidaire:'Frigidaire', whirlpool:'Whirlpool', samsung:'Samsung',
    lg:'LG', maytag:'Maytag', bosch:'Bosch',
    electrolux:'Électrolux', électrolux:'Électrolux',
    amana:'Amana', 'speed queen':'Speed Queen', ge:'GE',
    'général electric':'GE', 'general electric':'GE',
  }
  for (const [k,v] of Object.entries(synonymes)) {
    if (t.includes(k)) return v
  }
  return ''
}

function detectAppareil(txt) {
  const t = txt.toLowerCase()
  if (t.includes('lave-vaisselle') || t.includes('lavevaisselle') || t.includes('dishwasher') || t.includes('lave vaisselle')) return 'Lave-vaisselle'
  if (t.includes('laveuse') || t.includes('washer') || t.includes('lavante')) return 'Laveuse'
  if (t.includes('sécheuse') || t.includes('secheuse') || t.includes('dryer')) return 'Sécheuse'
  if (t.includes('réfrigérateur') || t.includes('refrigerateur') || t.includes('frigo') || t.includes('fridge')) return 'Réfrigérateur'
  if (t.includes('congélateur') || t.includes('congelateur') || t.includes('freezer')) return 'Congélateur'
  if (t.includes('cuisinière') || t.includes('cuisiniere') || t.includes('poêle') || t.includes('stove') || t.includes('four')) return 'Cuisinière'
  if (t.includes('micro-onde') || t.includes('microwave') || t.includes('micro onde')) return 'Micro-ondes'
  return ''
}