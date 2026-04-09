# CLAUDE.md — Projet MonsieurElectro Web App

## Liens importants

| Quoi | Adresse |
|---|---|
| App en ligne (Vercel) | https://monsieurelectro-app-git-main-jean17.vercel.app |
| Code source (GitHub) | https://github.com/wrebb379-rgb/monsieurelectro-app |
| Google Calendar | wrebb379@gmail.com |
| Vercel compte | jean17 |

> ⚠️ Le lien permanent à utiliser est le `-git-main-` — l'ancien lien `p5n3705g0` est un snapshot figé.

---

## Commandes utiles

**Démarrer en local :**
```
cd C:\Users\wrebb\monsieurelectro-app
npm run dev
```
Puis ouvre http://localhost:5173

**Déployer une mise à jour :**
```
git add . ; git commit -m "description du changement" ; git push
```
Vercel redéploie automatiquement en moins de 1 minute!

> ⚠️ Toujours vérifier que le terminal affiche `C:\Users\wrebb\monsieurelectro-app>` avant de taper git. Si tu vois juste `C:\Users\wrebb>`, tape d'abord `cd monsieurelectro-app`.

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
│   ├── App.jsx          ← navigation + topbar dorée
│   ├── App.css          ← design global (couleur #E8A800)
│   ├── main.jsx
│   ├── pages/
│   │   ├── Courriels.jsx    ← tableau de bord principal
│   │   ├── Calendrier.jsx   ← agenda + prochain RDV
│   │   ├── Regles.jsx       ← grille marque × appareil
│   │   ├── Region.jsx       ← villes et codes postaux
│   │   └── Phrases.jsx      ← textes de réponse
│   ├── utils/
│   │   ├── classifier.js    ← logique vert/jaune/rouge
│   │   └── parseGoDaddy.js  ← extraction champs courriel
│   └── data/
│       ├── regles.js        ← grille marque × appareil
│       ├── regions.js       ← villes/codes postaux
│       └── phrases.js       ← textes de réponse
└── public/
```

---

## Design system

- **Couleur principale** : #E8A800 (doré/jaune)
- **Vert** : #2E7D32 (probable, confirmé)
- **Rouge** : #C62828 (refus, hors secteur)
- **Fond** : #F5F5F5
- **Cartes** : blanc avec border-radius 12px, ombre légère
- **Topbar** : fond doré #E8A800, onglets blancs, hover vert
- **Bordures** : 1px solid #ddd (légères)
- **Séparateur sidebar/panel** : barre dorée 3px verticale

---

## Fonctionnalités complétées ✅

**Page Courriels :**
- Sidebar avec cases fixes (height 90px), bordure légère, scroll
- Barre de recherche pour filtrer les clients
- Compteur de clients
- Séparateur visuel doré entre sidebar et panel
- Entête client compact : trait doré à gauche, nom + badge sur une ligne, infos sur une ligne
- Infos appareil en chips (Marque, Appareil, Ville, Tél)
- Zone description avec pièce jointe et analyse colorée
- Zone réponse : bouton suggéré séparé + tous les boutons disponibles
- Aperçu du message avec bouton Envoyer
- Simulateur GoDaddy — colle un courriel brut, l'app l'analyse

**Page Calendrier :**
- Connecté au vrai Google Agenda (wrebb379@gmail.com)
- Données réelles affichées (7, 8, 9, 10, 13, 15 avril 2026)
- Calcul automatique du prochain RDV disponible
- Max RDV/jour configurable (défaut: 6)
- Blocage de journées
- Vue mois et semaine

**Pages Règles, Région, Phrases :**
- Grille marque × appareil modifiable
- Liste villes/codes postaux avec ajout/suppression
- Phrases modifiables avec {prenom} dynamique

---

## Règles de réparation actuelles

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

## Phrases types actuelles

- **Hors secteur** : "Bonjour {prenom}, Merci de m'avoir contacté. Malheureusement, votre adresse se situe en dehors de ma zone de service. Je vous suggère Tanguay, Léon, Corbeil ou Canadian Appliance Source..."
- **Je prends le dossier** : RDV disponible + tarifs 89,95$ déplacement + 80$ réparation
- **Marque non couverte** : refus poli avec bonne chance
- **Appareil non réparé** : liste des appareils couverts
- **Demander plus d'info** : modèle, code postal, description

---

## Informations business

- **Entreprise** : Monsieur Électro Services Inc.
- **Propriétaire** : Jean (solo)
- **Région** : Québec et environs
- **Tarifs** : Déplacement/diagnostic 89,95 $ · Réparation 80 $ supp. · Pièces et taxes en sus
- **Paiements** : Débit, chèque, virement Interac, argent comptant

---

## Prochaines étapes 🔜

1. **Connecter Outlook** — lire les vrais courriels entrants automatiquement
2. **Date dynamique** — prochain RDV réel inséré dans les réponses via Google Agenda
3. **Supabase** — sauvegarder règles, phrases, historique des réponses entre sessions
4. **Envoyer courriels** — bouton Envoyer qui envoie vraiment via Outlook
5. **Historique client** — voir les échanges passés quand un client réécrit

---

*Dernière mise à jour : 8 avril 2026*
*Session complète : maquettes → code React → GitHub → Vercel → design professionnel*
