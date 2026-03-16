<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Il y a un petit détail qui vient de traverser mon esprit. J'aurais peut-être besoin d'un contrat avec le client qui peut définir les informations sur un ou des projets. Même avant le contrat, d'avoir ou plutôt de faire une soumission a un potentiel client. Dont il me faut définir ces tables avec tous les informations que j'aurais besoin de mettre.

Voici l'ajout des sections **Soumission** et **Contrat** à ton cahier des charges, numérotées pour s'intégrer parfaitement (nouvelles sections 11 et 12).

***

# 11. Gestion des soumissions (devis)

11.1. Entité Soumission
11.1.1. La table `Soumission` contient au minimum :

- `id` : identifiant unique.
- `numero` : string unique (ex. "SMI-2026-001").
- `dateSoumission` : date de création.
- `clientId` : FK vers Client (obligatoire).
- `contactId` : FK vers Contact (optionnel, contact destinataire).
- `titre` : nom de la soumission (ex. "Développement site web").
- `description` : texte libre (contexte, besoins).
- `dateValidite` : date jusqu'à laquelle la soumission est valable.
- `statut` : brouillon | envoyee | acceptee | refusee | expiree.
- `sousTotalHT` : nombre.
- `montantTPS` : nombre.
- `montantTVQ` : nombre.
- `totalTTC` : nombre.

11.2. Entité SoumissionLigne
11.2.1. La table `SoumissionLigne` contient au minimum :

- `id` : identifiant unique.
- `soumissionId` : FK vers Soumission.
- `description` : texte (ex. "Analyse des besoins").
- `quantite` : nombre (ex. 10 heures).
- `prixUnitaire` : nombre (ex. 125.00).
- `montantLigne` : nombre (quantite × prixUnitaire).
- `typeLigne` : service | materiel | autre.

11.3. Règles métier soumission
11.3.1. Calcul automatique des totaux (sousTotalHT, TPS, TVQ, totalTTC) basé sur les paramètres de taxes du client.
11.3.2. Une soumission `acceptee` peut générer automatiquement un Contrat et un Projet.
11.3.3. Une soumission `refusee` ou `expiree` ne peut plus être modifiée.
11.3.4. Numérotation séquentielle unique (ex. SMI-AAAA-NNN).

11.4. Fonctionnalités soumission
11.4.1. Créer une soumission pour un client/contact.
11.4.2. Ajouter/modifier/supprimer des lignes de soumission.
11.4.3. Calcul automatique des totaux et taxes.
11.4.4. Changer le statut (brouillon → envoyee → acceptee/refusee).
11.4.5. Générer un PDF de la soumission (coordonnées, lignes, taxes).
11.4.6. Convertir une soumission acceptée en contrat + projet.

***

# 12. Gestion des contrats

12.1. Entité Contrat
12.1.1. La table `Contrat` contient au minimum :

- `id` : identifiant unique.
- `numero` : string unique (ex. "CTR-2026-001").
- `dateSignature` : date de signature.
- `dateDebut` : date de début du contrat.
- `dateFin` : date de fin (optionnel).
- `clientId` : FK vers Client (obligatoire).
- `contactId` : FK vers Contact (optionnel).
- `soumissionId` : FK vers Soumission (optionnel, source du contrat).
- `statut` : actif | suspendu | termine | archive.
- `montantTotalContrat` : nombre (valeur globale du contrat).
- `typeContrat` : horaire | forfait | banqueHeures | mixte.
- `conditionsSpeciales` : texte (modalités particulières).

12.2. Projets liés au contrat
12.2.1. Champ `contratId` : FK vers Contrat (optionnel) sur la table `Projet`.
12.2.2. Un contrat peut regrouper plusieurs projets.

12.3. Règles métier contrat
12.3.1. Un contrat doit être lié à un client existant.
12.3.2. Un projet peut être rattaché à un contrat (`projet.contratId`).
12.3.3. Seuls les projets d'un contrat actif peuvent générer des factures.
12.3.4. Un contrat terminé bloque la création de nouvelles TimeEntry facturables sur ses projets.

12.4. Fonctionnalités contrat
12.4.1. Créer un contrat à partir d'une soumission acceptée ou manuellement.
12.4.2. Lier un ou plusieurs projets à un contrat.
12.4.3. Changer le statut du contrat (actif → suspendu → termine).
12.4.4. Afficher la liste des projets et factures liés au contrat.
12.4.5. Générer un PDF du contrat (numéro, dates, montant, conditions).

***

## 13. Flux métier mis à jour (ajout au début)

**Flux complet client → facturation :**

13.1. **Potentiel client** → Créer Client + Contact → **Créer Soumission** → Client accepte.
13.2. **Soumission acceptée** → **Créer Contrat** → **Créer Projet(s)** lié(s) au contrat.
13.3. **Projet** → Créer Tâches → Saisir **TimeEntry** (début/fin) → **Préparer Facture**.
13.4. **Facture** → Envoyer → **Payée** → TimeEntry passe à `facture`.

***

## 14. Modifications des tables existantes

**Ajouts aux tables existantes :**

14.1. Table `Projet` → ajouter :

- `contratId` : FK vers Contrat (optionnel).

14.2. Table `Soumission` → peut servir de base pour générer le Contrat et ses lignes.

***

Tu peux insérer ces sections **11, 12, 13, 14** juste avant la section "Rôles et permissions" (qui devient 15). Le flux est maintenant complet : **Soumission → Contrat → Projet → Tâche → Temps → Facture**.

Veux-tu que je te fournisse maintenant le **schéma Prisma complet** avec toutes ces relations (Client, Contact, Soumission, Contrat, Projet, Tâche, TimeEntry, BankHeures, Facture, etc.) ?

