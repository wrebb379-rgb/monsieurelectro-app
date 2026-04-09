export function parseGoDaddy(raw, regles = []) {
  if (!raw) return vide()

  const text = raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')

  function champ(label) {
    const re = new RegExp(
      '(?:^|\\n)' + label + '\\s*\\n([^\\n]{1,300})',
      'i'
    )
    const m = text.match(re)
    return m ? m[1].trim() : ''
  }

  function champLigne(label) {
    const re = new RegExp(
      '(?:^|\\n)' + label + '[ \\t]+([^\\n]{1,300})',
      'i'
    )
    const m = text.match(re)
    return m ? m[1].trim() : ''
  }

  function bloc(labelDebut, labelsFin) {
    const re = new RegExp(
      '(?:^|\\n)' + labelDebut + '[^\\n]*\\n([\\s\\S]{1,1000})',
      'i'
    )
    const m = text.match(re)
    if (!m) return ''
    let contenu = m[1]
    for (const fin of labelsFin) {
      const idx = contenu.search(new RegExp('(?:^|\\n)' + fin, 'i'))
      if (idx > 0) contenu = contenu.substring(0, idx)
    }
    return contenu.trim()
  }

  const nom = (champ('Nom') || champLigne('Nom') || '').trim()

  // ✅ CORRIGÉ : prenom calculé ici
  const prenomBrut = nom.split(' ')[0] || 'Client'
  const prenom = prenomBrut.charAt(0).toUpperCase() + prenomBrut.slice(1).toLowerCase()

  const adresse = (champ('Adresse compl.+te') || champLigne('Adresse compl.+te') ||
                  champ('Adresse') || champLigne('Adresse') || '').trim()

  const ville = (champ('Ville') || champLigne('Ville') || '').trim()

  const tel = (champ('Votre t.+l.+phone') || champLigne('Votre t.+l.+phone') ||
              champ('T.+l.+phone') || champLigne('T.+l.+phone') || '').trim()

  const email = (champ('Email') || champLigne('Email') ||
                champ('Courriel') || champLigne('Courriel') || '').trim()

  const marqueRaw = (champ('Marque et num.+ro de mod.+le de l\'appareil') ||
                    champLigne('Marque et num.+ro de mod.+le de l\'appareil') ||
                    champ('Marque et num.+ro de mod.+le') ||
                    champLigne('Marque et num.+ro de mod.+le') ||
                    champ('Marque et mod.+le') || champLigne('Marque et mod.+le') ||
                    champ('Marque') || champLigne('Marque') || '').trim()

  const description = bloc(
    'Description du probl.+me[^\\n]*',
    ['Pi.+ces jointes', 'P.+riph.+rique', 'Langue', 'Envoy.+', 'Device', 'Platform']
  )

  const pieceJointe = (() => {
    const re = /\b([\w][\w.-]+\.(jpg|jpeg|png|gif|mp4|mov|avi|webm|pdf|zip))\b/gi
    const matches = [...raw.matchAll(re)]
    return matches
      .map(m => m[0])
      .filter(f => !f.toLowerCase().includes('logo') && f.length < 100)
  })()

  const cpMatch = adresse.match(/[GHJ]\d[A-Z]\s?\d[A-Z]\d/i) ||
                  ville.match(/[GHJ]\d[A-Z]\s?\d[A-Z]\d/i)
  const cp = cpMatch ? cpMatch[0].substring(0, 3).toUpperCase() : ''

  const marque = detectMarque(marqueRaw + ' ' + description, regles)
  const appareil = detectAppareil(marqueRaw + ' ' + description)

  // ✅ CORRIGÉ : prenom inclus dans le return
  return { nom, prenom, adresse, ville, cp, tel, email, marqueRaw, marque, appareil, description, pieceJointe }
}

function vide() {
  return { nom:'', prenom:'Client', adresse:'', ville:'', cp:'', tel:'', email:'', marqueRaw:'', marque:'', appareil:'', description:'', pieceJointe:[] }
}

function detectMarque(txt, regles) {
  const t = txt.toLowerCase()
  for (const r of (regles || [])) {
    if (t.includes(r.m.toLowerCase())) return r.m
  }
  const synonymes = {
    frigidaire:'Frigidaire', whirlpool:'Whirlpool', samsung:'Samsung',
    lg:'LG', maytag:'Maytag', bosch:'Bosch',
    electrolux:'Électrolux', électrolux:'Électrolux',
    amana:'Amana', 'speed queen':'Speed Queen',
    kenmore:'Kenmore', ge:'GE',
    'général electric':'GE', 'general electric':'GE',
    inglis:'Inglis', miele:'Miele', viking:'Viking',
  }
  for (const [k,v] of Object.entries(synonymes)) {
    if (t.includes(k)) return v
  }
  return ''
}

function detectAppareil(txt) {
  const t = txt.toLowerCase()
  if (t.includes('lave-vaisselle') || t.includes('lave vaisselle') ||
      t.includes('lavevaisselle') || t.includes('dishwasher') ||
      t.includes('vaisselle')) return 'Lave-vaisselle'
  if (t.includes('laveuse') || t.includes('washer') || t.includes('lavante')) return 'Laveuse'
  if (t.includes('sécheuse') || t.includes('secheuse') || t.includes('dryer') || t.includes('sécheu')) return 'Sécheuse'
  if (t.includes('réfrigérateur') || t.includes('refrigerateur') ||
      t.includes('frigo') || t.includes('fridge') || t.includes('réfrigé')) return 'Réfrigérateur'
  if (t.includes('congélateur') || t.includes('congelateur') || t.includes('freezer')) return 'Congélateur'
  if (t.includes('cuisinière') || t.includes('cuisiniere') ||
      t.includes('poêle') || t.includes('stove') || t.includes('four') ||
      t.includes('range')) return 'Cuisinière'
  if (t.includes('micro-onde') || t.includes('microwave') || t.includes('micro onde')) return 'Micro-ondes'
  return ''
}