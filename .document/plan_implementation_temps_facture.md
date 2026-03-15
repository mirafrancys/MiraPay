# 🗺️ Plan d'Implémentation - Module Gestion du Temps & Facturation

Ce plan d'action découpe la réalisation du module décrit dans le cahier des charges en plusieurs étapes logiques et progressives, afin de garantir la stabilité de l’application.

---

## 📅 Étape 1 : Architecture des Données (Base de Données)
*Objectif : Modéliser les entités dans Prisma et mettre à jour la base PostgreSQL.*

- [ ] **1.1. Modèles "Client" et "Projet" :**
  - Ajout du modèle `Client` (champs coordonnées + taxe).
  - Ajout du modèle `Project` (relations avec Client + Paramètres de facturation).
- [ ] **1.2. Modèles "Tâche" et "Saisie du Temps" :**
  - Ajout du modèle `Task` (priorité, statut, projet).
  - Ajout du modèle `TimeEntry` (durée, utilisateur, statut approuvé/brouillon).
- [ ] **1.3. Modèles "Facturation" :**
  - Ajout du modèle `Invoice` (statut, total additionné).
  - Ajout du modèle `InvoiceLine` (contenant la description des heures ou du forfait).
  - Table de liaison `InvoiceLineTimeEntry` pour lier les heures facturées.
- [ ] **1.4. Migration :**
  - Générer le client Prisma (`npm run db:generate`).
  - Mettre à jour la base de données (`npx prisma db push` ou `prisma migrate`).

---

## ⚙️ Étape 2 : Logiciel Backend (Express)
*Objectif : Créer les Routes API REST sécurisées pour le CRUD et la facturation.*

- [ ] **2.1. Contrôleurs de Base :**
  - Création des CRUD pour `Clients`, `Projets`, `Tâches`.
- [ ] **2.2. Gestion du Temps :**
  - Route d'insertion de Timesheet.
  - Système d'approbation restreint aux administrateurs.
- [ ] **2.3. Moteur de Facturation :**
  - Calcul automatique du sous-total, TPS et TVQ selon les règles de la province du client.
  - Verrouillage des entrées de temps lors du passage d’une facture au format validé.

---

## 🖥️ Étape 3 : Interface Frontend (Angular)
*Objectif : Créer les écrans de saisie et de dashbord.*

- [ ] **3.1. Gestion des Clients / Projets :**
  - Vue liste + Formulaire de création / Modification.
- [ ] **3.2. Saisie du Temps (Timesheets) :**
  - Calendrier ou liste pour déclarer le temps passé par tâche.
- [ ] **3.3. Module de Facturation :**
  - Écran de génération de facture (sélection date + projet).
  - Affichage PDF / Impression simple des factures.

---

### 👉 **Par quoi voulez-vous commencer ?**
Je vous recommande de valider la structure de données (**Étape 1**) en l'écrivant dans [schema.prisma](file:///r:/Projects/MiraPay/prisma/schema.prisma). Dites-moi si vous êtes d'accord pour que je commence à coder les nouveaux modèles Prisma !
