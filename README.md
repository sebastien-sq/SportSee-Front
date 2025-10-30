# SportSee - Dashboard Analytique Sportif

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=flat&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3.1.2-FF6B6B?style=flat)
![React Router](https://img.shields.io/badge/React_Router-7.8.1-CA4245?style=flat&logo=react-router&logoColor=white)

## 📋 Description

SportSee est une application web de tableau de bord analytique permettant aux utilisateurs de suivre leurs performances sportives et nutritionnelles. L'application affiche des graphiques interactifs et des statistiques détaillées sur l'activité physique, les sessions d'entraînement, les performances et les objectifs quotidiens.

### ✨ Fonctionnalités principales

- **Tableau de bord personnalisé** - Affichage des données utilisateur avec message de bienvenue
- **Graphique d'activité quotidienne** - Visualisation du poids et des calories brûlées sur plusieurs jours
- **Durée moyenne des sessions** - Graphique linéaire avec durée des sessions par jour de la semaine
- **Graphique de performance** - Radar montrant les performances sur 6 axes (Intensité, Vitesse, Force, Endurance, Énergie, Cardio)
- **Score quotidien** - Graphique circulaire affichant le pourcentage d'objectif atteint
- **Statistiques nutritionnelles** - Cartes affichant les calories, protéines, glucides et lipides
- **Mode développement flexible** - Basculement entre données mockées et API réelle

## 🚀 Technologies utilisées

- **React 19.1.1** - Bibliothèque JavaScript pour construire l'interface utilisateur
- **Vite 7.1.2** - Outil de build ultra-rapide avec HMR (Hot Module Replacement)
- **Recharts 3.1.2** - Bibliothèque de graphiques basée sur React et D3
- **React Router DOM 7.8.1** - Navigation et routing pour l'application
- **ESLint 9** - Linter pour garantir la qualité du code

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 16 ou supérieure)
- **npm** ou **pnpm** (gestionnaire de paquets)
- **Backend SportSee** (optionnel, uniquement si vous utilisez l'API réelle)

## 🛠️ Installation

1. **Cloner le repository**
```bash
git clone <url-du-repo>
cd SportSee-Front-2
```

2. **Installer les dépendances**
```bash
npm install
# ou
pnpm install
```

## 🎯 Démarrage

### Mode développement

```bash
npm run dev
# ou
pnpm dev
```

L'application sera accessible sur : `http://localhost:5173`

### Mode production

```bash
# Build de production
npm run build

# Prévisualisation du build
npm run preview
```

## ⚙️ Configuration

### Basculer entre données mockées et API

Le projet dispose d'un système de gestion de données flexible via `DataService.js` :

**Mode Mock (données simulées)** - Par défaut
```javascript
// src/services/DataService.js
static USE_MOCK_DATA = true;  // Utilise les données mockées
```

**Mode API (backend requis)**
```javascript
// src/services/DataService.js
static USE_MOCK_DATA = false;  // Utilise l'API réelle
static API_BASE_URL = "http://localhost:3000";  // URL du backend
```

### Configuration du backend

Si vous utilisez le mode API, assurez-vous que le backend SportSee est lancé sur `http://localhost:3000` avec les endpoints suivants :

- `GET /user/:id` - Informations utilisateur
- `GET /user/:id/activity` - Activité quotidienne
- `GET /user/:id/average-sessions` - Durée moyenne des sessions
- `GET /user/:id/performance` - Données de performance

## 📁 Structure du projet

```
SportSee-Front-2/
├── public/
│   └── fonts/                    # Polices personnalisées (Roboto)
├── src/
│   ├── assets/
│   │   ├── icons/                # Icônes des activités et nutriments
│   │   └── logo/                 # Logo SportSee
│   ├── components/
│   │   ├── charts/               # Composants de graphiques
│   │   │   ├── ActivityChart.jsx         # Graphique d'activité
│   │   │   ├── ActivityTooltip.jsx       # Tooltip personnalisé
│   │   │   ├── SessionsChart.jsx         # Graphique de sessions
│   │   │   ├── SessionsActiveDot.jsx     # Point actif du graphique
│   │   │   ├── PerformanceChart.jsx      # Graphique radar
│   │   │   ├── ScoreChart.jsx            # Graphique de score
│   │   │   ├── index.jsx                 # Export des graphiques
│   │   │   └── charts.css                # Styles des graphiques
│   │   ├── Header.jsx            # En-tête de l'application
│   │   ├── Sidebar.jsx           # Barre latérale
│   │   ├── header.css
│   │   └── sidebar.css
│   ├── page/
│   │   ├── Dashboard.jsx         # Page principale du dashboard
│   │   └── dashboard.css
│   ├── services/
│   │   ├── DataService.js        # Service de gestion des données
│   │   ├── sportSeeAPI.js        # Interface API SportSee
│   │   ├── hooks.js              # Hooks React génériques
│   │   ├── chartHooks.js         # Hooks spécialisés pour graphiques
│   │   └── mockData.js           # Données mockées pour développement
│   ├── App.jsx                   # Composant racine
│   ├── AppRouter.jsx             # Configuration du routing
│   ├── main.jsx                  # Point d'entrée
│   ├── index.css                 # Styles globaux
│   └── normalize.css             # Reset CSS
├── .eslintrc.js                  # Configuration ESLint
├── vite.config.js                # Configuration Vite
└── package.json
```

## 🎨 Composants principaux

### Graphiques

- **ActivityChart** - Graphique en barres combiné (poids + calories)
- **SessionsChart** - Graphique linéaire avec gradient et overlay interactif
- **PerformanceChart** - Graphique radar à 6 axes
- **ScoreChart** - Graphique circulaire (donut chart)

### Hooks personnalisés

**Hooks génériques** (`hooks.js`)
- `useUser(userId)` - Récupère les données complètes de l'utilisateur
- `useUserActivity(userId)` - Récupère l'activité quotidienne
- `useUserSessions(userId)` - Récupère les sessions moyennes
- `useUserPerformance(userId)` - Récupère les données de performance

**Hooks spécialisés pour graphiques** (`chartHooks.js`)
- `useActivityChart(userId)` - Formate les données pour le graphique d'activité
- `useSessionsChart(userId)` - Formate les données avec points fantômes
- `usePerformanceChart(userId)` - Traduit et ordonne les données de performance
- `useScoreChart(userId)` - Convertit le score en pourcentage
- `useAllCharts(userId)` - Charge toutes les données de graphiques

## 🌐 Navigation

L'application utilise React Router avec les routes suivantes :

- `/user/:userId` - Dashboard de l'utilisateur (ex: `/user/18`)
- `*` - Redirection vers `/user/18` par défaut

### Utilisateurs disponibles

- **User 18** - Cecilia (données complètes)
- **User 12** - Karl (données complètes)

## 📊 Format des données

### Données utilisateur
```javascript
{
  id: 18,
  userInfos: {
    firstName: "Cecilia",
    lastName: "Ratorez",
    age: 34
  },
  todayScore: 0.3,  // ou score: 0.3
  keyData: {
    calorieCount: 2500,
    proteinCount: 155,
    carbohydrateCount: 290,
    lipidCount: 50
  }
}
```

### Activité quotidienne
```javascript
{
  sessions: [
    { day: "2020-07-01", kilogram: 80, calories: 240 },
    // ...
  ]
}
```

### Sessions moyennes
```javascript
{
  sessions: [
    { day: 1, sessionLength: 30 },  // 1 = Lundi
    // ...
  ]
}
```

### Performance
```javascript
{
  kind: {
    1: 'cardio',
    2: 'energy',
    3: 'endurance',
    4: 'strength',
    5: 'speed',
    6: 'intensity'
  },
  data: [
    { value: 80, kind: 1 },
    // ...
  ]
}
```

## 🎨 Styles et Design

- **Architecture CSS** - BEM (Block Element Modifier)
- **Police principale** - Roboto (Regular, Medium, Bold)
- **Couleurs principales** :
  - Rouge primaire : `#FF0101`
  - Noir : `#020203`
  - Gris : `#74798C`
  - Blanc : `#FFFFFF`

## 🧪 Linting

```bash
npm run lint
```

Le projet utilise ESLint avec les règles recommandées pour React et les hooks.

## 📝 Documentation

Tous les composants et hooks sont documentés avec JSDoc incluant :
- Description de la fonction/composant
- Paramètres avec types
- Valeurs de retour
- Exemples d'utilisation

Générer la documentation :
```bash
npm run jsdoc
```

## 🐛 Dépannage

### Problème : L'application ne charge pas les données

**Solution** : Vérifiez que le mode de données est correctement configuré dans `DataService.js`
- Si `USE_MOCK_DATA = true` : les données mockées seront utilisées
- Si `USE_MOCK_DATA = false` : vérifiez que le backend est lancé sur `http://localhost:3000`

### Problème : Erreur CORS avec l'API

**Solution** : Assurez-vous que le backend autorise les requêtes depuis `http://localhost:5173`

### Problème : Les graphiques ne s'affichent pas

**Solution** : 
1. Vérifiez la console pour les erreurs
2. Assurez-vous que les données ont le bon format
3. Vérifiez que Recharts est correctement installé : `npm install recharts`


## 📄 Licence

Ce projet fait partie du parcours de formation OpenClassrooms - Développeur d'application JavaScript React.


---

**Note** : Ce projet utilise Vite avec SWC pour un Fast Refresh ultra-rapide pendant le développement.