# ⚡ IRONPULSE - Suivi Musculation, Nutrition & Préparation Hyrox 2027

Application web moderne, mobile-first (pensée spécifiquement pour une utilisation sur smartphone à la salle de musculation), responsive et prête à être déployée sur **Vercel** et **GitHub**.

---

## 🚀 Fonctionnalités Clés

### 1. 🏋️ Module Musculation & Surcharge Progressive
- **Lancement de séance rapide** : Push, Pull, Legs, Upper, Lower, Full Body, Hyrox Strength ou Séance Libre.
- **Mode direct à la salle** :
  - Saisie tactile XXL du Poids (kg) et Répétitions avec pavé numérique optimisé (`inputMode="decimal"`).
  - Visualisation instantanée de la **dernière performance** sur l'exercice pour appliquer la surcharge progressive.
  - Sélecteur d'effort perçu (RPE de 6 à 10).
  - **Chronomètre de repos interactif** (30s, 60s, 90s, 120s, 180s) avec compte à rebours, jauge circulaire, son de fin et mode réduit.
- **Bibliothèque d'exercices** : Plus de 50 exercices pré-intégrés par groupe musculaire + ajout d'exercices personnalisés.
- **Graphiques de progression** : Calcul automatique et courbe d'évolution du **1RM estimé (Epley)**, de la charge maximale et du tonnage total.

### 2. 🥗 Module Profil, Métabolisme & Nutrition
- **Calculateur de Métabolisme BMR** : Formules de **Mifflin-St Jeor** et **Harris-Benedict (révisée)** commutables en 1 clic.
- **Dépense Énergétique Totale (TDEE)** : Calcul précis selon 5 niveaux d'activité physique.
- **Objectif & Macros** : Calculateur automatique de budget calorique et de répartition des macronutriments (Protéines, Glucides, Lipides) selon l'objectif (Sèche, Maintien, Prise de masse, Recomposition corporelle).
- **Suivi du Poids** : Pesée du matin avec graphique de tendance Recharts et calcul des variations.

### 3. ⏱️ Module Préparation Spéciale "Hyrox Avril 2027"
- **Compte à rebours dynamique** vers mi-avril 2027 (Jours, Heures, Minutes, Secondes).
- **Fiches et Suivi des 8 Stations Officielles** :
  1. SkiErg (1 000 m)
  2. Sled Push (50 m)
  3. Sled Pull (50 m)
  4. Burpee Broad Jumps (80 m)
  5. Rowing (1 000 m)
  6. Farmers Carry (200 m)
  7. Sandbag Lunges (100 m)
  8. Wall Balls (75 ou 100 reps)
- **Course 1 km** : Suivi des blocs d'allure au 1 000 m.
- **Tableau de bord des Records Personnels (PR)** et repères chronos (Élite / Intermédiaire / Finisher).
- **Simulateur de Chrono Global Hyrox** : Projection instantanée du temps total (8 km Course + 8 Stations + Transitions Roxzone).

---

## 🛠️ Stack Technique

- **Frontend** : Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Canvas-Confetti.
- **Backend / BDD / Auth** : Supabase (PostgreSQL, Row Level Security, Auth Google OAuth).
- **Mode Hors-Ligne / Démo** : Fonctionne immédiatement en local / preview sans configuration obligatoire grâce au système de persistance réactive `LocalStorage`, avec synchronisation automatique vers Supabase dès renseignement des clés.

---

## 📦 Installation & Démarrage Local

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) sur votre navigateur ou sur votre smartphone (via votre réseau local).

---

## 🗄️ Configuration Supabase & Google OAuth

### Étape 1 : Créer la base de données
1. Rendez-vous sur votre tableau de bord [Supabase](https://supabase.com) et créez un nouveau projet.
2. Allez dans le **SQL Editor**.
3. Copiez et collez l'intégralité du fichier [`supabase-schema.sql`](./supabase-schema.sql) puis cliquez sur **Run**.
   - Cela crée les tables (`profiles`, `exercises`, `workouts`, `workout_sets`, `weight_logs`, `hyrox_logs`), les politiques de sécurité RLS isolant les données de chaque utilisateur, et la bibliothèque initiale d'exercices.

### Étape 2 : Configurer Google OAuth
1. Dans Supabase : **Authentication > Providers > Google**.
2. Activez Google et renseignez vos identifiants Client ID & Client Secret depuis la [Google Cloud Console](https://console.cloud.google.com).
3. Ajoutez l'URL de redirection autorisée : `https://<votre-id-supabase>.supabase.co/auth/v1/callback`.

### Étape 3 : Configurer le fichier d'environnement
Créez un fichier `.env.local` à la racine :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-publique
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🚢 Déploiement en 1 clic sur Vercel & GitHub

1. Créez un repository sur votre compte GitHub et poussez le code :
   ```bash
   git init
   git add .
   git commit -m "Initial commit - IronPulse"
   git remote add origin https://github.com/votre-compte/iron-pulse.git
   git push -u origin main
   ```
2. Rendez-vous sur [Vercel](https://vercel.com) et importez votre repository GitHub.
3. Ajoutez les variables d'environnement dans les paramètres Vercel :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (ex: `https://votre-app.vercel.app`)
4. Cliquez sur **Deploy** ! L'application est prête à être installée en PWA sur votre écran d'accueil de smartphone.
