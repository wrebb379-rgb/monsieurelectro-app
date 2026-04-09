export function classifier(email, regles, regions) {
  if (!email) return { code: 'yellow', label: 'À vérifier', reason: 'Aucun courriel sélectionné', phraseKey: 'info' }

  const appareils = ['Laveuse','Sécheuse','Réfrigérateur','Congélateur','Lave-vaisselle','Cuisinière']

  
function normaliser(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // enlève les accents
  }

  const regionOk = regions.some(r => {
    const rl = normaliser(r)
    const ville = normaliser(email.ville)
    const cp = normaliser(email.cp)
    return ville.includes(rl) || rl.includes(ville) || cp.startsWith(rl)
  })

  if (!regionOk) return {
    code: 'red', label: 'Hors secteur',
    reason: `"${email.ville}" n'est pas dans ta zone de service.`,
    phraseKey: 'secteur'
  }

  if (!appareils.includes(email.appareil)) return {
    code: 'red', label: 'Refus probable',
    reason: `"${email.appareil || 'Appareil inconnu'}" n'est pas dans tes appareils réparés.`,
    phraseKey: 'appareil'
  }

  const row = regles.find(r => r.m.toLowerCase() === (email.marque || '').toLowerCase())

  if (!row) return {
    code: 'yellow', label: 'À vérifier',
    reason: `Marque "${email.marque}" non reconnue — vérifie manuellement.`,
    phraseKey: 'info'
  }

  const cell = row.c[email.appareil]
  if (!cell) return {
    code: 'yellow', label: 'À vérifier',
    reason: 'Combinaison marque/appareil inconnue.',
    phraseKey: 'info'
  }

  if (cell[0] === 1) {
    const note = cell[1] ? ` (${cell[1]})` : ''
    return {
      code: 'green', label: 'Probable',
      reason: `${email.marque} + ${email.appareil}${note} — secteur couvert ✓`,
      phraseKey: 'prendre'
    }
  }

  return {
    code: 'red', label: 'Refus probable',
    reason: `${email.marque} non couvert pour ${email.appareil}.`,
    phraseKey: 'marque'
  }
}