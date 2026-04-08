# CLAUDE.md — Projet MonsieurElectro Web App

## Liens importants

| Quoi | Adresse |
|---|---|
| App en ligne (Vercel) | https://monsieurelectro-p5n3705g0-jean17.vercel.app |
| Code source (GitHub) | https://github.com/wrebb379-rgb/monsieurelectro-app |
| Google Calendar | wrebb379@gmail.com |
| Vercel compte | jean17 |

---

## Description du projet

Application web de gestion des courriels clients pour **Monsieur Électro Services Inc.**,
une entreprise solo de réparation d'électroménagers dans la région de Québec.

---

## Stack technique

| Composant | Technologie | Statut |
|---|---|---|
| Interface | React + Vite | ✅ Déployé |
| Hébergement | Vercel | ✅ En ligne |
| Base de données | Supabase | 🔜 À connecter |
| Google Agenda | Google Calendar API | ✅ Connecté (lecture) |
| Courriels entrants | Microsoft Graph API (Outlook) | 🔜 À connecter |
| Envoi de courriels | Gmail API ou SMTP | 🔜 À connecter |

---

## Structure du projet

```
C:\Users\wrebb\monsieurelectro-app\
├── CLAUDE.md
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── pages/
│   │   ├── Courriels.jsx
│   │   ├── Calendrier.jsx
│   │   ├── Regles.jsx
│   │   ├── Region.jsx
│   │   └── Phrases.jsx
│   ├── utils/
│   │   ├── classifier.js
│   │   └── parseGoDaddy.js
│   └── data/
│       ├── regles.js
│       ├── regions.js
│       └── phrases.js
└── public/
```

---

## Fonctionnalités complétées ✅

- Tableau de bord courriels avec classification vert/jaune/rouge
- Fiche client complète avec pièces jointes
- Simulateur GoDaddy — colle un courriel brut et l'app l'analyse
- Grille marque × appareil modifiable case par case
- Région couverte — villes et codes postaux
- Phrases types modifiables avec {prenom} dynamique
- Calendrier mensuel avec données réelles Google Agenda
- Calcul automatique du prochain RDV disponible
- Blocage de journées (vacances, maladie)
- Max RDV/jour configurable (défaut: 6)
- App déployée sur Vercel — accessible partout

---

## Prochaines étapes 🔜

1. **Connecter Outlook** — lire les vrais courriels entrants
2. **Date dynamique** — prochain RDV réel dans les réponses
3. **Supabase** — sauvegarder les règles/phrases entre sessions
4. **Envoyer courriels** — bouton Envoyer fonctionnel

---

## Règles de réparation

| Marque | Laveuse | Sécheuse | Frigo | Congélo | Lave-vaisselle | Cuisinière |
|---|---|---|---|---|---|---|
| Whirlpool | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Maytag | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Frigidaire | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GE | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Bosch | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Électrolux | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Amana | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Speed Queen | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Samsung | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| LG | ✅ frontale seul. | ✅ frontale seul. | ❌ | ❌ | ❌ | ❌ |

---

## Informations business

- **Entreprise** : Monsieur Électro Services Inc.
- **Propriétaire** : Jean (solo)
- **Région** : Québec et environs
- **Tarifs** : Déplacement/diagnostic 89,95 $ · Réparation 80 $ supp. · Pièces et taxes en sus
- **Paiements** : Débit, chèque, virement Interac, argent comptant

---

## Commandes utiles

**Démarrer en local :**
```
cd C:\Users\wrebb\monsieurelectro-app
npm run dev
```
Puis ouvre http://localhost:5174

**Déployer une mise à jour :**
```
git add .
git commit -m "description du changement"
git push
```
Vercel redéploie automatiquement en moins de 1 minute!

---

*Dernière mise à jour : 7 avril 2026*
*App déployée et fonctionnelle sur Vercel*
