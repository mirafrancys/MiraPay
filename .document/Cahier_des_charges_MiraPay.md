# 📋 Cahier des Charges & Architecture - Projet MiraPay

Ce document dresse la structure technique et les spécifications de l'architecture **MiraPay**. Il sert de guide de référence complet (blueprint) pour répliquer ou démarrer un nouveau projet basé sur ce socle technologique.

---

## 🛠️ 1. Stack Technologique

| Composant | Technologie | Rôle |
| :--- | :--- | :--- |
| **Gestionnaire de Monorepo** | [Nx Workspace](https://nx.dev) | Orchestration des applications et librairies partagées |
| **Frontend** | Angular 18+ | Interface Utilisateur (Dashboard, Login, Client) |
| **Backend** | Node.js + Express | API REST (Gestion de la logique métier) |
| **ORM (Database)** | Prisma (v7+) | Accès sécurisé type-safe à la base de données |
| **Base de Données** | PostgreSQL | Stockage persistant et relationnel |
| **Authentification** | Bcrypt | Chiffrement et vérification des mots de passe |

---

## 📂 2. Structure du Workspace (Monorepo Nx)

```text
/MiraPay
├── apps/
│   ├── mirapay-frontend/         # 🖥️ Application Angular (Port 4200)
│   │   ├── src/app/cores/gateways/ # Passerelles pour fetch l'API
│   │   └── proxy.conf.json        # Configuration du Proxy transparent dev
│   │
│   └── mirapay-backend/          # ⚙️ Application Express (Port 3000)
│       └── src/
│           ├── app/
│           │   ├── auth/         # Contrôleur d'authentification
│           │   ├── users/        # Logique des Utilisateurs
│           │   ├── transactions/ # Logique des Transactions
│           │   └── prisma-client.ts # Initialisation du client Prisma
│           └── generated/prisma/ # 📂 Sortie personnalisée du client Prisma
│
└── prisma/
    ├── schema.prisma             # 🗺️ Définition des Modèles de données
    └── seed.ts                    # Script d’initialisation (Seed)
```

---

## ⚙️ 3. Spécifications & Configurations Clés

### A. Base de Données (Prisma)
Le fichier [schema.prisma](file:///r:/Projects/MiraPay/prisma/schema.prisma) doit contenir explicitement le lien vers la variable d'environnement :
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
*   **Axe d'amélioration :** La sortie personnalisée (`output = "../apps/mirapay-backend/src/generated/prisma"`) isole le client au sein du backend pour une structure plus propre dans un environnement multi-app.

### B. Proxy Transparent en Développement
Pour faciliter le développement et contourner les erreurs **CORS**, le frontend Angular hébergé sur `localhost:4200` rebascule les requêtes `/api` vers le backend `localhost:3000` via [proxy.conf.json](file:///r:/Projects/MiraPay/apps/mirapay-frontend/proxy.conf.json) :
```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

---

## 🧾 4. Spécifications Fonctionnelles (MVP)

1.  **Gestion des Rôles :**
    *   `ADMIN`, `USER`, `MANAGER`.
    *   Configuration typesafe via relations Prisma.

2.  **Authentification :**
    *   Route `/api/auth/login`.
    *   Recherche par `email` ou `username`.
    *   Mode de secours (Fallback) en mémoire si la DB est vide (`admin` / `admin123`).
    *   Chiffrement Bcrypt obligatoire pour les mots de passe.

3.  **Transactions :**
    *   Création et suivi par Utilisateur (Inclusions relationnelles complexes).

---

## 🏃 5. Kit de Démarrage (Commandes Utiles)

### Initialisation & Dépendances
```bash
npm install
```

### Base de données & Migrations
```bash
# 1. Pousser le modèle de données vers SQL
npx prisma db push

# 2. Re-générer les types du Client Prisma
npx prisma generate

# 3. Charger le seed (Créer l'Admin par défaut)
npx ts-node seed.ts
```

### Lancement des Applications
```bash
# Démarrer TOUT en même temps (Front + Back)
npm run start

# Démarrer uniquement le Backend
nx serve mirapay-backend

# Démarrer uniquement le Frontend
nx serve mirapay-frontend
```
