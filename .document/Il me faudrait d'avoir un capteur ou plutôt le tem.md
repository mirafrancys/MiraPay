<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Il me faudrait d'avoir un capteur ou plutôt le temps que je passe sur une tâche. Je dois indiquer le début et la fin d'une tâche mais je peux mettre plusieurs temps passer sur une tâche définie sur un projet. Chacun des temps passer, je peux facturer ou pas et je dois indiquer soit la tâche est facturer avec tout le temps que j'ai fait.

Tu as besoin d’un modèle d’« entrées de temps » qui gère plusieurs intervalles sur la même tâche, chacun marqué facturable ou non, et une vue qui sait si toute la tâche est facturée.[^1][^2]

## 1. Structure pour mesurer le temps par tâche

### 1.1 Entrée de temps (intervalle)

Pour chaque période où tu travailles sur une tâche, crée une **TimeEntry** séparée :

- id
- userId
- projetId
- tacheId
- date
- heureDebut
- heureFin
- dureeHeures (calculée à partir début/fin)[^2][^1]
- estFacturable (booléen)[^1][^2]
- statut : brouillon | approuve | facture
- commentaire (ce que tu as fait)

Tu peux utiliser un « timer » (start/stop) pour remplir heureDebut/heureFin automatiquement, ou saisir les valeurs à la main.[^3][^4]

### 1.2 Plusieurs temps sur une même tâche

Comme chaque **TimeEntry** pointe vers tacheId, tu peux avoir :

- Tâche A (projet X)
    - TimeEntry 1 : 09:00–10:15, estFacturable = true
    - TimeEntry 2 : 14:00–14:30, estFacturable = false (ex. appel interne)
    - TimeEntry 3 : 16:00–17:00, estFacturable = true

La durée totale de la tâche = somme de toutes les entrées.
Le temps facturable de la tâche = somme des entrées avec estFacturable = true.[^2][^1]

## 2. Lien avec la facturation

### 2.1 Passage d’une entrée de temps à la facture

- Quand tu prépares une facture, tu listes toutes les TimeEntry approuve, estFacturable = true, non encore facture.[^5][^1]
- Tu les regroupes en lignes de facture (par tâche ou par projet).
- Au moment de valider la facture, tu passes ces TimeEntry au statut facture.[^1]


### 2.2 « Tâche facturée » vs « temps facturable »

Pour savoir si une tâche est **entièrement facturée**, tu peux :

- Champ calculé au niveau Tâche :
    - totalHeuresFacturables = somme des TimeEntry.estFacturable = true.
    - totalHeuresFacturees = somme des TimeEntry.estFacturable = true et statut = facture.
- Indicateur tacheEntierementFacturee = (totalHeuresFacturees >= totalHeuresFacturables).

Ça te permet de voir, pour chaque tâche, si tout le temps facturable a bien été facturé, même si tu as plusieurs intervalles de travail dessus.[^2][^1]

***

Si tu veux, je peux te renvoyer la section « 5. Gestion du temps » de ton cahier de charges réécrite avec cette logique (début/fin, multiples entrées, et calcul « tâche entièrement facturée ») prête à coller dans ton document Antigravity.
<span style="display:none">[^10][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.getharvest.com/blog/is-there-a-template-for-billable-hours

[^2]: https://www.clicktime.com/resources/billing-rate-template

[^3]: https://www.timerewards.com/billable-vs-non-billable-hours/

[^4]: https://www.timely.com/business-impacts/billable-vs-non-billable

[^5]: https://answers.apptivo.com/questions/10892/how-can-i-enter-time-for-multiple-projects-in-a-single-timesheet

[^6]: https://blog.orangescrum.com/billable-vs-non-billable-hours-how-to-track-and-maximize-profitability/

[^7]: https://community.smartsheet.com/discussion/65688/project-management-automating-timelines-across-multiple-projects-sheets

[^8]: https://toggl.com/blog/billable-vs-non-billable

[^9]: https://www.youtube.com/watch?v=KVjakZjfl2g

[^10]: https://www.timetackle.com/template-of-timesheet/

