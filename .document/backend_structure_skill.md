# Guide de Structuration Backend (Skill)

Ce document décrit l'architecture standard à suivre pour ajouter ou modifier des fonctionnalités dans le backend de MiraPay (`mirapay-backend`).

La structure repose sur une séparation claire des responsabilités entre :
1. **Les Interfaces** (Définition des types et structures de données)
2. **Les Services** (Logique d'affaires et accès à la base de données via Prisma)
3. **Les Contrôleurs** (Gestion des requêtes et réponses HTTP Express)
4. **Les Routes** (Définition des endpoints et liaison avec les contrôleurs)

---

## 1. Structure des Dossiers

Tous les fichiers doivent être placés dans leurs répertoires respectifs sous `src/app/` :

```text
src/app/
├── controllers/          # Fichiers *.controller.ts et *.controller.spec.ts
├── services/             # Fichiers *.service.ts
├── routes/               # Fichiers *.ts (définition des routes Express)
├── interfaces/           # Fichiers *.interface.ts (types et interfaces personnalisés)
├── prisma-client.ts      # Client Prisma partagé
└── prisma.ts             # Initialisation optionnelle
```

---

## 2. Guide d'implémentation par composant

Prenons l'exemple d'une entité **Client** pour illustrer la structure globale.

### A. L'Interface (`src/app/interfaces/client.interface.ts`)
Si l'interface de Prisma ne suffit pas (par exemple, pour des validations d'API ou des structures de retour agrégées), créez une interface personnalisée.

```typescript
export interface CreateClientInput {
  nomLegal: string;
  typeClient: 'entreprise' | 'particulier';
  adresseLigne1: string;
  adresseLigne2?: string;
  ville: string;
  province: string;
  codePostal: string;
  pays: string;
  courriel: string;
  telephone: string;
  modeFacturationParDefaut: string;
}

export interface ClientWithStats {
  id: string;
  nomLegal: string;
  totalProjets: number;
  totalFactures: number;
}
```

### B. Le Service (`src/app/services/clients.service.ts`)
Le service est responsable de l'interaction avec la base de données (Prisma) et de la logique métier.
- Importe le client `prisma` depuis `../prisma-client`.
- Exporte une classe de service sans l'instancier directement (l'instanciation se fait dans le contrôleur).

```typescript
import prisma from '../prisma-client';
import { Client } from '@prisma/client';
import { CreateClientInput } from '../interfaces/client.interface';

export class ClientsService {
  async getAll(): Promise<Client[]> {
    return prisma.client.findMany({
      orderBy: { nomLegal: 'asc' },
    });
  }

  async getById(id: string): Promise<Client | null> {
    return prisma.client.findUnique({
      where: { id },
    });
  }

  async create(data: CreateClientInput): Promise<Client> {
    return prisma.client.create({
      data,
    });
  }

  async update(id: string, data: Partial<CreateClientInput>): Promise<Client> {
    return prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Client> {
    return prisma.client.delete({
      where: { id },
    });
  }
}
```

### C. Le Contrôleur (`src/app/controllers/clients.controller.ts`)
Le contrôleur intercepte les requêtes Express, appelle le service et renvoie la réponse HTTP.
- Importe `Request` et `Response` de `express`.
- Importe la classe de service depuis `../services/`.
- Instancie le service localement.
- Exporte la classe du contrôleur ainsi qu'une **instance singleton** à la fin du fichier.

```typescript
import { Request, Response } from 'express';
import { ClientsService } from '../services/clients.service';

const clientsService = new ClientsService();

export class ClientsController {
  async getAll(req: Request, res: Response) {
    try {
      const clients = await clientsService.getAll();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const client = await clientsService.getById(id);
      if (!client) {
        return res.status(404).json({ error: `Client avec l'ID ${id} non trouvé` });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const client = await clientsService.create(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const client = await clientsService.update(id, req.body);
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await clientsService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

// Export d'une instance singleton pour utilisation dans les routes
export const clientsController = new ClientsController();
```

### D. La Route (`src/app/routes/clients.ts`)
Le fichier de route associe les endpoints HTTP aux méthodes du contrôleur.
- Importe `Router` de `express`.
- Importe l'instance singleton du contrôleur depuis `../controllers/`.
- Exporte le `router` par défaut.

```typescript
import { Router } from 'express';
import { clientsController } from '../controllers/clients.controller';

const router = Router();

// Récupérer tous les clients
router.get('/', clientsController.getAll);

// Récupérer un client par ID
router.get('/:id', clientsController.getOne);

// Créer un nouveau client
router.post('/', clientsController.create);

// Mettre à jour un client
router.put('/:id', clientsController.update);

// Supprimer un client
router.delete('/:id', clientsController.delete);

export default router;
```

N'oubliez pas d'enregistrer la nouvelle route dans le fichier central des routes `src/app/routes/index.ts`.

---

## 3. Bonnes Pratiques & Conventions

- **Noms de fichiers** : Utilisez le pluriel ou le nom exact de la table Prisma en minuscules, séparé par des tirets si nécessaire (ex: `time-entries.service.ts`, `bank-hours.controller.ts`).
- **Instanciation** : Les services sont instanciés en haut du fichier contrôleur (`const xService = new XService()`). Les contrôleurs exportent une instance nommée singleton (`export const xController = new XController()`).
- **Gestion des erreurs** : Enveloppez toujours le code des contrôleurs dans des blocs `try/catch` pour éviter que l'application ne plante sur une exception non gérée, et renvoyez un code HTTP approprié (ex: `500` pour erreur interne, `404` pour non trouvé, `400`/`409` pour des requêtes invalides).
