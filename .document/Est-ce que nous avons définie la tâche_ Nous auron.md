<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Est-ce que nous avons définie la tâche? Nous aurons différent type de statut pour la tâche dont "new", "en cours", "analyse", "fermer", "terminer". Cette tâche serait facturable ou pas. La tâche serait toujours lier avec un projet. Nous pouvons ajouter des notes rattacher à la tâche.

Oui, on avait déjà posé une base de « tâche », mais on va la préciser clairement avec tes statuts, le caractère facturable et les notes.[^1][^2]

## 1. Statuts de la tâche

Prévois un champ `statut` sur la tâche avec les valeurs suivantes :

- `new` : tâche créée, pas encore commencée (équivalent « Not started »).[^2]
- `analyse` : en phase d’analyse (clarification, devis, etc.).[^3]
- `en_cours` : travail en cours sur la tâche.[^1][^2]
- `terminer` : travail terminé, en attente de revue ou de facturation.[^2][^1]
- `fermer` : tâche complétement clôturée (temps final, facturation traitée si nécessaire).[^4][^2]

Tu peux plus tard ajouter d’autres statuts (ex. « en_attente » / « bloqué »), le modèle reste extensible.[^1][^2]

## 2. Tâche facturable ou pas

Au niveau **Tâche**, ajoute un champ :

- `tacheFacturable` (booléen)

Logique recommandée :

- Si `tacheFacturable = false` : par défaut, toutes les entrées de temps liées à cette tâche sont non facturables (tu peux forcer `estFacturable = false` au niveau TimeEntry).[^5][^6]
- Si `tacheFacturable = true` : chaque entrée de temps peut être marquée `estFacturable = true/false` selon le cas (ex. 1h de travail facturable, 15 min d’appel interne non facturable).[^7][^6]

Ainsi, tu as :

- un niveau « politique » (la tâche est prévue comme facturable ou non),
- un niveau « réel » (chaque intervalle de temps est facturable ou non).[^7][^5]


## 3. Lien tâche – projet

La contrainte reste :

- `tache.projetId` obligatoire (FK vers Projet)
- Une tâche ne peut exister sans projet.[^8]

Dans l’interface :

- Sur le projet, tu vois la liste de toutes les tâches.
- Sur une tâche, tu affiches le projet parent (nom, client, etc.).[^8]


## 4. Notes rattachées à la tâche

Tu as deux options :

### 4.1 Notes intégrées dans la tâche

- Champ `notes` (texte long / rich text) sur la tâche pour consigner : comptes‑rendus de discussions, décisions, idées, etc.[^9][^10]

Simple, suffisant si tu as peu de notes par tâche.

### 4.2 Notes comme entité séparée

Si tu veux un vrai historique :

Entité `TaskNote` :

- id
- tacheId (FK)
- userId (qui a écrit la note)
- dateHeureCreation
- contenu (texte)

Fonctionnalités :

- Ajouter une note à partir de la fiche tâche.
- Voir la chronologie des notes pour la tâche (journal).[^10][^9]

Ce modèle colle bien à ce qui se fait dans les outils de gestion de projet/CRM modernes.[^8]

## 5. Formulation pour ton cahier des charges (bloc prêt à coller)

Tu peux ajouter / remplacer ta section Tâche par ce texte :

> 4.1. Entité Tâche
>  4.1.1. La tâche est toujours rattachée à un projet (champ `projetId` obligatoire).
>  4.1.2. Champs minimums :
>  - `id` (identifiant)
>  - `projetId` (FK)
>  - `titre`
>  - `description`
>  - `statut` ∈ {`new`, `analyse`, `en_cours`, `terminer`, `fermer`}
>  - `tacheFacturable` (booléen)
>  - `priorite` (basse | normale | haute)
>  - `dateDebutPrevue` (optionnel)
>  - `dateEcheance` (optionnel)
>  - `notes` (texte) ou entité `TaskNote` liée.
>
>  4.1.3. La tâche peut recevoir plusieurs entrées de temps (TimeEntry) facturables ou non facturables.
>  4.1.4. Une tâche peut être considérée comme « entièrement facturée » lorsque toutes ses entrées de temps facturables sont associées à une facture (logique de calcul prévue au niveau projet/tâche).

Si tu veux, je peux maintenant te réécrire la **section 5 Gestion du temps** avec tout ce que tu m’as dit (début/fin de chaque intervalle, plusieurs intervalles par tâche, facturable/non facturable, et tâche entièrement facturée) sous forme numérotée prête pour Antigravity.

<div align="center">⁂</div>

[^1]: https://www.openproject.org/docs/system-admin-guide/manage-work-packages/work-package-status/

[^2]: https://www.goodday.work/help/customization/statuses

[^3]: https://www.notion.com/help/guides/status-property-gives-clarity-on-tasks

[^4]: https://help.cognota.com/en/articles/6125321-i-want-to-update-my-project-status-tasks-budget-and-files

[^5]: https://www.timerewards.com/billable-vs-non-billable-hours/

[^6]: https://hubstaff.com/time-tracking/billable-vs-non-billable-hours

[^7]: https://www.apps365.com/blog/billable-vs-non-billable-hours/

[^8]: https://www.youtube.com/watch?v=ho1Mp5RPF1w

[^9]: https://www.reddit.com/r/productivity/comments/1erud4u/how_do_you_link_your_notes_and_research_to_your/

[^10]: https://help.noteplan.co/article/93-part-4-project-notes-best-practices

