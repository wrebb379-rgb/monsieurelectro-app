# CLAUDE.md — Projet MonsieurElectro Web App

## Liens importants

| Quoi | Adresse |
|---|---|
| App en ligne (Vercel) | https://monsieurelectro-app-git-main-jean17.vercel.app |
| Code source (GitHub) | https://github.com/wrebb379-rgb/monsieurelectro-app |
| Google Calendar | wrebb379@gmail.com |
| Vercel compte | jean17 |
| Outlook business | infos@monsieurelectro.com |
| Azure App ID | 9445d18c-ef16-479a-be00-0846553b5dba |
| Azure Tenant ID | ae72419d-0db1-49d0-8cea-95622e0cc016 |

> ⚠️ Toujours utiliser le lien `-git-main-` pour Vercel — l'ancien lien `p5n3705g0` est un snapshot figé.

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
git add . ; git commit -m "description" ; git push
```
> ⚠️ Toujours vérifier que le terminal affiche `C:\Users\wrebb\monsieurelectro-app>` avant de taper git.

---

## Stack technique

| Composant | Technologie | Statut |
|---|---|---|
| Interface | React + Vite | ✅ Déployé |
| Hébergement | Vercel | ✅ En ligne |
| Base de données | Supabase | 🔜 À connecter |
| Google Agenda | Google Calendar API | ✅ Connecté (lecture) |
| Courriels entrants | Microsoft Graph API (Outlook) | ✅ Connecté (lecture seule) |
| Envoi de courriels | À faire | 🔜 À connecter |

---

## Structure du projet

```
C:\Users\wrebb\monsieurelectro-app\
├── CLAUDE.md
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx              ← navigation + topbar dorée
│   ├── App.css              ← design global (#E8A800)
│   ├── main.jsx
│   ├── authConfig.js        ← config Azure/MSAL
│   ├── useOutlook.js        ← hook connexion Outlook (lecture)
│   ├── pages/
│   │   ├── Courriels.jsx    ← tableau de bord + vrais courriels Outlook
│   │   ├── Calendrier.jsx   ← agenda + prochain RDV
│   │   ├── Regles.jsx       ← grille marque × appareil
│   │   ├── Region.jsx       ← villes et codes postaux
│   │   └── Phrases.jsx      ← textes de réponse
│   ├── utils/
│   │   ├── classifier.js    ← logique vert/jaune/rouge
│   │   └── parseGoDaddy.js  ← extraction champs courriel GoDaddy
│   └── data/
│       ├── regles.js
│       ├── regions.js
│       └── phrases.js
└── public/
```

---

## Design system

- **Couleur principale** : #E8A800 (doré/jaune) — topbar, accents
- **Vert** : #2E7D32 (probable, confirmé)
- **Rouge** : #C62828 (refus, hors secteur)
- **Fond** : #F5F5F5
- **Cartes** : blanc, border-radius 12px, ombre légère, border 1px #ddd
- **Séparateur sidebar/panel** : barre dorée 3px verticale
- **Onglets actifs** : blanc avec underline blanc, hover vert

---

## Fonctionnalités complétées ✅

**Connexion Outlook (lecture seule) :**
- Bouton bleu "📧 Connecter Outlook" dans la page Courriels
- Connexion via Microsoft Graph API (Azure App ID configuré)
- Filtre automatique : seulement les courriels avec "Monsieur Electro Services Inc. a reçu un nouveau message"
- Exclut les replies (Re:, Rép:)
- stripHtml() pour nettoyer le HTML des courriels
- bodyTexte propre passé à parseGoDaddy

**Page Courriels :**
- Sidebar cases fixes (height 90px) avec scroll, bordure légère
- Barre de recherche + compteur de clients
- Séparateur visuel doré entre sidebar et panel
- Entête client compact : trait doré gauche, nom + badge sur une ligne
- Infos appareil en chips
- Zone description + pièces jointes + analyse colorée
- Bouton suggéré + tous les boutons disponibles
- Simulateur GoDaddy (colle un courriel brut)
- Données fictives si Outlook non connecté

**parseGoDaddy.js — format réel GoDaddy :**
```
Monsieur Electro Services Inc. a reçu un nouveau message.
Nom Julie Villeneuve
Adresse complète 4776 Avenue de la Villa St Vincent
Ville Quebec City
Votre téléphone 581-983-3530
Email Johnsysliver@yahoo.com
Marque et numéro de modèle de l'appareil Kenmore 665.13769K601
Description du problème. ...
Pièces jointes ...
Périphérique mobile
Langue fr-CA
Envoyé depuis Page d'accueil
```

**Page Calendrier :**
- Connecté au vrai Google Agenda (wrebb379@gmail.com)
- Calcul automatique du prochain RDV disponible
- Max RDV/jour configurable (défaut: 6)
- Blocage de journées

**Pages Règles, Région, Phrases :**
- Grille marque × appareil modifiable
- Villes/codes postaux avec ajout/suppression
- Phrases modifiables avec {prenom} dynamique

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
| Kenmore | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Phrases types

- **Hors secteur** : Suggère Tanguay, Léon, Corbeil, Canadian Appliance Source
- **Je prends le dossier** : RDV + tarifs 89,95$ déplacement + 80$ réparation
- **Marque non couverte** : refus poli
- **Appareil non réparé** : liste des appareils couverts
- **Demander plus d'info** : modèle, code postal, description

---

## Informations business

- **Entreprise** : Monsieur Électro Services Inc.
- **Propriétaire** : Jean (solo)
- **Région** : Québec et environs
- **Tarifs** : Déplacement/diagnostic 89,95 $ · Réparation 80 $ supp.
- **Paiements** : Débit, chèque, virement Interac, argent comptant
- **Courriel business** : infos@monsieurelectro.com (Outlook/Exchange GoDaddy)

---

## Azure / Microsoft Graph — Configuration

- **App name** : MonsieurElectro
- **Client ID** : 9445d18c-ef16-479a-be00-0846553b5dba
- **Tenant ID** : ae72419d-0db1-49d0-8cea-95622e0cc016
- **Redirect URIs** :
  - http://localhost:5173
  - https://monsieurelectro-app-git-main-jean17.vercel.app
- **Permissions** : User.Read, Mail.Read (déléguées)
- **Type** : Application monopage (SPA)
- **Mode connexion** : loginRedirect (pas loginPopup)

---

## Prochaines étapes 🔜

1. **Améliorer le parsing** — tester avec plus de vrais courriels, ajuster les regex
2. **Supabase** — sauvegarder règles/phrases entre sessions
3. **Envoyer courriels** — bouton Envoyer via Outlook (Microsoft Graph)
4. **Historique** — voir les échanges passés quand un client réécrit
5. **Kenmore** — ajouter dans la grille des règles (marque fréquente)

---

*Dernière mise à jour : 8 avril 2026 — soir*
*Session : maquettes → React → GitHub → Vercel → design → Outlook connecté*
