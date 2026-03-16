<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Nous avons définie une banque d'heure pour le client mais nous n'avons même pas généré la table pour mettre cet information et même de l'utiliser avec les contraint sur la consommation des heures.

Tu as raison : on a parlé de « banque d’heures », mais pas encore défini les tables ni les contraintes d’usage. Voici un modèle simple que tu peux intégrer à ton cahier des charges.

## 1. Principe général de la banque d’heures

- Une **banque d’heures** correspond à un bloc d’heures prépayées pour un client, souvent lié à un projet ou à une période (ex. forfait de 20 h de support).[^1][^2]
- L’application doit empêcher ou au minimum signaler quand les heures consommées dépassent les heures achetées.[^3][^4]

Tu peux choisir :

- banque par **projet** (le plus simple),
- ou banque globale par **client** (utilisable sur plusieurs projets).[^5][^3]

Ci‑dessous, je pars sur « banque par projet » (adaptable en banque par client si tu changes les FK).

***

## 2. Entité BankHeures (banque d’heures)

### 2.1 Données

Nouvelle table/entité `BankHeures` :

- `id` : identifiant interne unique.
- `clientId` : FK vers Client.
- `projetId` : FK vers Projet (optionnel si tu veux aussi des banques globales client).
- `nom` : nom de la banque (ex. « Support 20 h – T1 2026 »).
- `description` : texte libre (conditions, type de services couverts).
- `heuresAchetees` : nombre (ex. 20.0).
- `heuresConsommees` : nombre (calculé ou mis à jour via logique métier).
- `dateDebut` : date de début de validité (optionnelle).
- `dateFin` : date de fin de validité (optionnelle).
- `estActive` : booléen.

Option si tu veux gérer le prix de la banque :

- `montantTotal` : montant payé pour ces heures.
- `tauxHoraireEquivalent` : montantTotal / heuresAchetees (facultatif, calculable).[^6][^1]

***

## 3. Lien entre banque d’heures et temps consommé

### 3.1 Association TimeEntry ↔ BankHeures

Pour savoir quelles heures consomment quelle banque, ajoute un lien :

Option A (simple) : ajouter un champ sur TimeEntry

- `bankHeuresId` : FK vers BankHeures (optionnel).

Option B (plus flexible, mais souvent inutile) : table de liaison

- `BankHeuresTimeEntry` (bankHeuresId, timeEntryId).

En pratique, l’option A suffit dans ton cas.

### 3.2 Règles métier de consommation

Quand tu enregistres ou approuves une TimeEntry facturable sur un projet avec banque d’heures :

1. Déterminer s’il existe une BankHeures active associée au projet (ou au client).[^4][^3]
2. Si oui, lier la TimeEntry à cette BankHeures (`bankHeuresId`) si tu veux consommer cette banque.
3. Calculer la consommation totale :
    - `heuresConsommees = somme(TimeEntry.dureeHeures)` pour toutes les TimeEntry facturables liées à cette BankHeures.
4. Vérifier la limite :
    - Si `heuresConsommees > heuresAchetees` :
        - soit bloquer la saisie/approbation,
        - soit autoriser mais afficher un avertissement « Banque d’heures dépassée ».[^3][^4]

Tu peux aussi prévoir une option de config :

- modeStrict : interdiction de dépasser la banque.
- modeSouple : dépassement autorisé mais signalé.

***

## 4. Mise à jour dans ton cahier des charges (bloc prêt à coller)

Tu peux ajouter une nouvelle section, par exemple **3.5 Banque d’heures**, ou dans la partie projet.

> 3.5. Banque d’heures
>  3.5.1. Le système doit permettre de définir des banques d’heures pour un client et/ou un projet.
>  3.5.2. Entité `BankHeures` (banque d’heures) :
>  - `id`
>  - `clientId` (FK)
>  - `projetId` (FK, optionnel)
>  - `nom`
>  - `description`
>  - `heuresAchetees` (nombre)
>  - `heuresConsommees` (nombre)
>  - `dateDebut` (optionnel)
>  - `dateFin` (optionnel)
>  - `estActive` (booléen)
>  3.5.3. Chaque entrée de temps (`TimeEntry`) peut être rattachée à une banque d’heures via le champ `bankHeuresId`.
>  3.5.4. Les heures consommées d’une banque sont calculées comme la somme des `dureeHeures` de toutes les TimeEntry facturables liées à cette banque.
>  3.5.5. Le système doit vérifier que `heuresConsommees` ne dépasse pas `heuresAchetees` :
>  - en mode strict, l’enregistrement/validation de nouvelles TimeEntry au‑delà de la limite est interdit,
>  - en mode souple, il est autorisé mais un avertissement est affiché à l’utilisateur.
>  3.5.6. Dans la fiche projet et la fiche client, un indicateur doit afficher pour chaque banque d’heures : `heuresAchetees`, `heuresConsommees`, `soldeHeures = heuresAchetees − heuresConsommees`.

Si tu veux, je peux te proposer directement un brouillon de modèle Prisma pour `BankHeures` + les champs à ajouter dans `TimeEntry`.
<span style="display:none">[^10][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.helcim.com/guides/retainer-payments/

[^2]: https://www.reddit.com/r/web_design/comments/vitqz7/how_are_you_handling_payments_within_a_retainer/

[^3]: https://everhour.com/blog/time-tracking-limit/

[^4]: https://www.silverdale.us/blog/silverdale-apps-13/restrict-over-spend-hours-f1945-3828

[^5]: https://everhour.com

[^6]: https://www.rocketlane.com/resources/psa/project-billing-for-professional-services

[^7]: https://www.hrreporter.com/focus-areas/payroll/ask-an-expert/306639

[^8]: https://hrinsider.ca/banking-of-overtime-know-the-laws-of-your-province/?print=print

[^9]: https://toggl.com/blog/how-to-track-billable-hours

[^10]: https://blog.payworks.ca/the-ins-and-outs-of-banking-overtime-in-canada

