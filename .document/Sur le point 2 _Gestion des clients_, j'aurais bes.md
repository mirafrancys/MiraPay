<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Sur le point 2 "Gestion des clients", j'aurais besoin de pouvoir ajouter des contacts. Quel sont les informations que j'aurais besoin et en même temps je pourrais l'utiliser qui a demandé ce nouveau projet. En plus de faire un suivie des courriel dont dans l'envoie et la réception même si par exemple le courriel de Google de pouvoir .

Pour gérer des contacts par client, identifier qui a demandé un projet et suivre les courriels (envoyés/reçus, ex. Gmail), tu peux étendre ton point 2 comme ceci.

***

## 2.x Gestion des contacts (par client)

2.x.1. Chaque client peut avoir plusieurs contacts.
2.x.2. Un contact peut être utilisé comme « demandeur » d’un projet et comme destinataire des courriels liés au projet.

### 2.x.1 Données « Contact »

Pour chaque contact, prévois au minimum :

- id : identifiant interne.
- clientId : référence au client.
- prenom.
- nom.
- fonctionPoste (ex. directeur TI, responsable achats).
- courrielProfessionnel.
- telephonePrincipal.
- telephoneMobile (optionnel).
- languePreference (fr | en, utile pour les courriels/factures).
- estContactPrincipal : booléen (contact par défaut pour ce client).
- estActif : booléen.
- notesInternesContact : texte libre (infos sur la relation, préférences de communication, etc.).

Règles métier :

- Un contact appartient toujours à un seul client.
- Il doit y avoir au plus un estContactPrincipal = true par client (optionnel mais recommandé).

Fonctions :

- Créer / modifier / désactiver un contact pour un client.
- Lister les contacts d’un client.
- Filtrer par actif / inactif.

***

## 3.x Lien entre contact et projet (qui a demandé le projet)

Dans la fiche projet, ajoute :

- demandeurContactId : référence à Contact (optionnelle mais recommandée).

Règles :

- Lors de la création d’un projet, l’utilisateur peut sélectionner le contact demandeur parmi les contacts du client.
- Ce contact pourra être utilisé par défaut pour :
    - envoyer les courriels liés au projet,
    - adresser les devis ou les résumés d’avancement.

***

## 2.y Suivi des courriels (CRM léger)

Tu peux ajouter une entité « EmailLog » (journal des échanges) liée aux clients, contacts et projets.

### 2.y.1 Données « EmailLog »

- id : identifiant interne.
- clientId : référence au client.
- contactId : référence au contact (optionnelle si c’est un courriel générique).
- projetId : référence au projet (optionnelle si l’échange est général).
- type : envoye | recu.
- dateHeure : date/heure du courriel.
- adresseExpediteur.
- adresseDestinataire.
- sujet.
- extraitContenu : texte (court résumé ou premières lignes).
- messageIdExterne : identifiant du courriel dans le système externe (ex. Gmail Message-ID).
- lienExterne : URL vers le courriel dans Gmail (si tu le stockes).
- aPiecesJointes : booléen.


### 2.y.2 Règles métier courriels

- Le système doit pouvoir lier un courriel au minimum à un client, et si possible à un contact et/ou un projet.
- Pour un courriel envoyé depuis l’application, le système enregistre automatiquement un EmailLog (type envoye).
- Pour un courriel reçu (via intégration externe : à faire plus tard), le système peut créer un EmailLog (type recu) en détectant le client/contact sur l’adresse courriel.


### 2.y.3 Intégration éventuelle avec Gmail (note de conception)

Dans le cahier de charge, tu peux indiquer comme besoin (même si tu ne l’implémentes pas tout de suite) :

- Possibilité future de connecter une boîte Gmail :
    - lecture des courriels via API,
    - création automatique des EmailLog à partir des messages,
    - mappage client/contact en fonction des adresses courriel.

***

## 2.z Fonctionnalités de suivi dans l’interface

Pour exploiter ces données :

- Sur la fiche Client :
    - onglet « Contacts » listant tous les contacts du client.
    - onglet « Courriels » listant les EmailLog liés au client (filtre par projet, contact, type).
- Sur la fiche Projet :
    - champ « Demandeur » (contact lié).
    - onglet « Courriels » ne montrant que les EmailLog liés à ce projet.
- Sur la fiche Contact :
    - liste des projets où ce contact est demandeur ou contact impliqué.
    - liste des EmailLog liés à ce contact.

***

Si tu veux, je peux t’intégrer ces points directement dans ta section 2 existante avec la même numérotation (2.6, 2.7, etc.) pour que tu puisses simplement remplacer/compléter ton cahier de charge actuel.
<span style="display:none">[^1][^10][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.pappers.fr/entreprise/societe-de-conseil-en-management-de-projets-803246032

[^2]: https://systemproject.fr/conseil-gestion-projet/

[^3]: https://www.lechefdeprojet.ma/missions-conseil/

[^4]: https://www.gesprojet.com/societe

[^5]: https://www.ledigitalpme.fr/activites/gestion-de-projets.html

[^6]: https://www.pappers.fr/entreprise/societe-de-gestion-de-projets-414948547

[^7]: https://www.accesscorp.com/fr-ca/solutions/gestion-de-l-information/gestion-de-projets/

[^8]: http://www.gestiondesprojets.com

[^9]: https://www.pmimontreal.org/la-gestion-de-projet

[^10]: https://gestiondeprojet.pm

