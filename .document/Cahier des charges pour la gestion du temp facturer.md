Voici une version numérotée, prête à être collée telle quelle dans Antigravity comme cahier des charges pour ton module « Clients / Projets / Tâches / Temps / Facturation » (en supposant que l’auth, les rôles et la stack Angular + Express + Prisma + PostgreSQL existent déjà).

***

# 1. Objet du projet

1.1. Contexte
L’application dispose déjà d’un système d’authentification avec rôles, d’un backend Express avec Prisma et d’une base PostgreSQL, ainsi que d’un frontend Angular.
Le présent cahier des charges spécifie le module métier de gestion des clients, projets, tâches, temps et facturation.

1.2. Objectifs
1.2.1. Permettre d’enregistrer et de consulter les informations clients.
1.2.2. Gérer des projets rattachés aux clients, avec paramètres de facturation.
1.2.3. Déclarer le temps passé sur des tâches de projet, en distinguant facturable / non facturable.
1.2.4. Générer des factures à partir du temps saisi et/ou de forfaits, avec calcul automatique des taxes (TPS/TVQ).

1.3. Périmètre
1.3.1. Inclus : gestion des clients, projets, tâches, entrées de temps, factures.
1.3.2. Exclus : comptabilité générale, paie, gestion de stocks.

***

# 2. Gestion des clients

2.1. Données « Client »
Le système doit gérer une entité Client avec au minimum les champs suivants :
2.1.1. id : identifiant interne unique.
2.1.2. typeClient : entreprise | particulier.
2.1.3. nomLegal : nom légal du client.
2.1.4. adresseLigne1, adresseLigne2 (optionnelle).
2.1.5. ville.
2.1.6. province.
2.1.7. codePostal.
2.1.8. pays.
2.1.9. courriel.
2.1.10. telephone.
2.1.11. contactNom (pour une entreprise).
2.1.12. contactFonction (optionnel).
2.1.13. notesInternes (texte libre).

2.2. Paramètres de facturation client
2.2.1. modeFacturationParDefaut : horaire | forfait | banqueHeures | nonFacturable.
2.2.2. deviseParDefaut : string (ex. "CAD").
2.2.3. conditionsPaiement : texte (ex. "Net 30 jours").
2.2.4. modesPaiement : texte libre (Interac, virement, etc.).

2.3. Taxes client
2.3.1. clientTaxable : booléen.
2.3.2. appliquerTPS : booléen.
2.3.3. appliquerTVQ : booléen.

2.4. Règles métier client
2.4.1. Il est interdit de supprimer un client qui possède au moins un projet ; il doit être archivé (champ estArchive : booléen).
2.4.2. La province et le statut taxable du client servent de base au calcul des taxes sur les factures.

2.5. Fonctionnalités client
2.5.1. Créer un client.
2.5.2. Modifier un client.
2.5.3. Archiver un client.
2.5.4. Rechercher des clients (par nom, courriel, téléphone).
2.5.5. Afficher la liste des projets associés à un client.
2.5.6. Afficher l’historique des factures d’un client.

***

# 3. Gestion des projets

3.1. Données « Projet »
Le système doit gérer une entité Projet avec au minimum les champs suivants :
3.1.1. id : identifiant interne unique.
3.1.2. clientId : référence au Client (FK obligatoire).
3.1.3. nom : nom du projet.
3.1.4. description : texte.
3.1.5. dateDebut : date.
3.1.6. dateFinPrevue : date (optionnelle).
3.1.7. statut : brouillon | enCours | enPause | termine | facture | archive.

3.2. Paramètres de facturation projet
3.2.1. typeFacturation : horaire | forfait | banqueHeures.
3.2.2. tauxHoraire : nombre (pour facturation horaire).
3.2.3. montantForfait : nombre (pour projet forfait).
3.2.4. heuresBanqueTotales : nombre (pour banque d’heures).
3.2.5. heuresBanqueConsommees : nombre (calculé ou mis à jour).
3.2.6. budgetHeuresPrevu : nombre (optionnel).
3.2.7. budgetMontantPrevu : nombre (optionnel).
3.2.8. arrondiHeures : 0.25 | 0.5 | 1 (ou valeur numérique).

3.3. Règles métier projet
3.3.1. Un projet doit toujours référencer un client existant.
3.3.2. Sur un projet de type forfait, les entrées de temps sont enregistrées mais la facture peut se baser sur montantForfait.
3.3.3. Sur un projet de type banqueHeures, le système doit pouvoir calculer le solde restant = heuresBanqueTotales − heuresBanqueConsommees.

3.4. Fonctionnalités projet
3.4.1. Créer un projet pour un client.
3.4.2. Modifier un projet.
3.4.3. Archiver un projet.
3.4.4. Lister les projets (filtres : client, statut, date).
3.4.5. Afficher un tableau de bord projet : heures totales saisies, heures facturables, heures facturées, solde de banque d’heures le cas échéant.

***

# 4. Gestion des tâches

4.1. Données « Tâche »
L’entité Tâche contient au minimum :
4.1.1. id : identifiant unique.
4.1.2. projetId : référence au Projet (FK obligatoire).
4.1.3. titre : string.
4.1.4. description : texte.
4.1.5. type : string (analyse, développement, réunion, support, etc.).
4.1.6. priorite : basse | normale | haute.
4.1.7. statut : aFaire | enCours | enAttente | termine.
4.1.8. dateDebutPrevue : date (optionnelle).
4.1.9. dateEcheance : date (optionnelle).

4.2. Règles métier tâche
4.2.1. Une tâche ne peut exister sans projet.
4.2.2. Le changement de statut de la tâche n’affecte pas directement la facturation, mais doit être reflété dans l’interface.

4.3. Fonctionnalités tâche
4.3.1. Créer une tâche pour un projet.
4.3.2. Modifier une tâche.
4.3.3. Supprimer une tâche (sous réserve qu’aucune entrée de temps ne la référence ou via règle spécifique).
4.3.4. Lister les tâches d’un projet (filtres : statut, priorité, type).
4.3.5. Optionnel : vue Kanban par statut.

***

# 5. Gestion du temps (timesheets)

5.1. Données « Entrée de temps »
L’entité TimeEntry contient au minimum :
5.1.1. id : identifiant unique.
5.1.2. userId : référence à l’utilisateur (FK).
5.1.3. date : date de l’entrée.
5.1.4. projetId : référence au Projet (FK).
5.1.5. tacheId : référence à la Tâche (FK, optionnelle mais recommandée).
5.1.6. dureeHeures : nombre (possibilité de décimal).
5.1.7. estFacturable : booléen.
5.1.8. commentaire : texte (optionnel).
5.1.9. statut : brouillon | approuve | facture.

5.2. Règles métier temps
5.2.1. Une entrée de temps au statut facture ne peut plus être modifiée ni supprimée.
5.2.2. Le changement de statut à approuve peut être réservé à un rôle spécifique (Admin par exemple).
5.2.3. Les entrées non facturables ne doivent pas être proposées lors de la préparation d’une facture.

5.3. Fonctionnalités temps
5.3.1. Créer une entrée de temps (date, projet, tâche, durée, commentaire, facturable).
5.3.2. Modifier ou supprimer une entrée au statut brouillon.
5.3.3. Changer le statut d’une entrée (brouillon → approuve).
5.3.4. Filtrer les entrées par période, projet, client, estFacturable.
5.3.5. Afficher des rapports simples : total heures par projet / client / période.

***

# 6. Gestion de la facturation

6.1. Données « Facture »
L’entité Facture contient au minimum :
6.1.1. id : identifiant unique.
6.1.2. numero : string unique (numérotation séquentielle).
6.1.3. dateFacture : date.
6.1.4. clientId : référence au Client.
6.1.5. projetId : référence principale au Projet (optionnel, si multi-projets).
6.1.6. statut : brouillon | envoyee | payee | enRetard | annulee.
6.1.7. sousTotal : nombre.
6.1.8. montantTPS : nombre.
6.1.9. montantTVQ : nombre.
6.1.10. totalTTC : nombre.
6.1.11. conditionsPaiement : texte.

6.2. Données « Ligne de facture »
6.2.1. id : identifiant unique.
6.2.2. factureId : référence à la Facture (FK).
6.2.3. projetId : référence au Projet (FK, optionnel).
6.2.4. description : texte.
6.2.5. quantite : nombre (ex. heures).
6.2.6. prixUnitaire : nombre.
6.2.7. montantLigne : nombre.

6.3. Lien avec les entrées de temps
6.3.1. Le système doit permettre de lier une ligne de facture à un ensemble d’entrées de temps :

- table de liaison InvoiceLineTimeEntry (invoiceLineId, timeEntryId).
6.3.2. Lorsqu’une facture est validée, les entrées de temps associées passent au statut facture.

6.4. Règles métier facturation
6.4.1. Le numero de facture doit être unique.
6.4.2. La génération d’une facture à partir du temps ne peut prendre en compte que des entrées au statut approuve et estFacturable = true.
6.4.3. Les montants des taxes sont calculés en fonction des paramètres du client (clientTaxable, appliquerTPS, appliquerTVQ) et des taux définis dans la configuration de l’application.
6.4.4. Une facture au statut annulee ne peut plus être modifiée.

6.5. Fonctionnalités de facturation
6.5.1. Écran de préparation de facture :

- sélection d’un client, d’un projet et d’une période,
- affichage des entrées de temps approuve, non facturées, facturables,
- regroupement des entrées en lignes de facture (par projet, tâche ou période).
6.5.2. Calcul automatique du sousTotal, de la TPS, de la TVQ et du totalTTC.
6.5.3. Génération d’une facture en statut brouillon.
6.5.4. Changement de statut : brouillon → envoyee → payee → enRetard → annulee.
6.5.5. Export / impression de la facture (PDF ou autre format à implémenter).
6.5.6. Liste des factures par client, statut, période.

***

# 7. Rôles et permissions

7.1. Rôle Admin
7.1.1. Accès complet sur clients, projets, tâches, temps et factures.
7.1.2. Peut approuver des entrées de temps.
7.1.3. Peut modifier les paramètres globaux (taux de taxes, format numérotation, etc.).

7.2. Rôle Utilisateur standard
7.2.1. Peut créer/éditer ses tâches et entrées de temps.
7.2.2. Peut consulter les projets et clients autorisés.
7.2.3. Peut préparer des factures (ou optionnellement les générer, selon la configuration).

***

# 8. Exigences techniques spécifiques

8.1. Backend
8.1.1. Les nouvelles entités (Client, Projet, Tache, TimeEntry, Facture, FactureLigne, liaison FactureLigne–TimeEntry) doivent être définies dans le schéma Prisma.
8.1.2. Les routes API doivent respecter l’architecture REST déjà en place (CRUD + routes spécialisées pour préparation de facture, génération de facture).
8.1.3. Les opérations de génération de facture doivent être transactionnelles (création de facture, lignes, mise à jour des TimeEntry).

8.2. Frontend
8.2.1. Créer les écrans Angular nécessaires pour :

- gestion des clients,
- projets,
- tâches,
- saisie du temps,
- préparation des factures,
- liste / détail des factures.
8.2.2. Implémenter les formulaires avec validation de base (champs obligatoires, formats simples).

***

# 9. Évolutions possibles (hors périmètre immédiat)

9.1. Gestion de devis avant facture.
9.2. Notes de crédit / avoirs.
9.3. Rapports avancés (rentabilité par client, par projet, par type de tâche).

***

Tu peux prendre ce texte, l’ajuster (changements de noms de champs, supprimer les parties inutiles), puis le coller dans ton fichier de spécification/PRD Antigravity pour qu’il génère la structure de ton application autour de ce module.
<span style="display:none">[^1][^10][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://lzw.me/docs/opencodedocs/fr/NoeFabris/opencode-antigravity-auth/appendix/api-spec/

[^2]: https://www.youtube.com/watch?v=Fkfv96HdpPA

[^3]: https://lilys.ai/notes/fr/google-antigravity-20251209/google-antigravity-beginner-tutorial

[^4]: https://www.youtube.com/watch?v=KTuwdpHZBzI

[^5]: https://www.sfeir.dev/ia/google-antigravity-lide-agentique-de-google-avec-gemini-3-pro-guide-complet/

[^6]: https://codelabs.developers.google.com/getting-started-google-antigravity?hl=fr

[^7]: https://antigravityai.directory/antigravity-file-guide

[^8]: https://codelabs.developers.google.com/getting-started-google-antigravity

[^9]: https://www.youtube.com/watch?v=cikMpZen0I4

[^10]: https://www.youtube.com/watch?v=mOqhhDXUgUo

