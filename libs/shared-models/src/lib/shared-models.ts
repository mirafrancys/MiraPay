export interface Role {
  id: string;
  name: string; // ex: ADMIN, CUSTOMER, SUPPORT
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Opt to exclude from payload
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date | string;
  address?: string;
  city?: string;
  country?: string;
  isActive: boolean;
  roleId?: string;
  role?: Role;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Client {
  id: string;
  typeClient: string; // entreprise | particulier
  nomLegal: string;
  adresseLigne1: string;
  adresseLigne2?: string;
  ville: string;
  province: string;
  codePostal: string;
  pays: string;
  courriel: string;
  telephone: string;
  contactNom?: string;
  contactFonction?: string;
  notesInternes?: string;
  modeFacturationParDefaut: string; // horaire | forfait | banqueHeures | nonFacturable
  deviseParDefaut: string;
  conditionsPaiement?: string;
  modesPaiement?: string;
  clientTaxable: boolean;
  appliquerTPS: boolean;
  appliquerTVQ: boolean;
  estArchive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Project {
  id: string;
  clientId: string;
  client?: Client;
  nom: string;
  description?: string;
  dateDebut: Date | string;
  dateFinPrevue?: Date | string;
  statut: string; // brouillon | enCours | enPause | termine | facture | archive
  typeFacturation: string; // horaire | forfait | banqueHeures
  tauxHoraire?: number;
  montantForfait?: number;
  heuresBanqueTotales?: number;
  heuresBanqueConsommees: number;
  budgetHeuresPrevu?: number;
  budgetMontantPrevu?: number;
  arrondiHeures?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Task {
  id: string;
  projetId: string;
  projet?: Project;
  titre: string;
  description?: string;
  type: string; // analyse, développement, réunion, support
  tacheFacturable: boolean;
  priorite: string; // basse | normale | haute
  statut: string; // new | analyse | en_cours | terminer | fermer
  dateDebutPrevue?: Date | string;
  dateEcheance?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TaskNote {
  id: string;
  tacheId: string;
  tache?: Task;
  userId: string;
  user?: User;
  contenu: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  user?: User;
  date: Date | string;
  projetId: string;
  projet?: Project;
  tacheId?: string;
  tache?: Task;
  dureeHeures: number;
  estFacturable: boolean;
  commentaire?: string;
  statut: string; // brouillon | approuve | facture
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Invoice {
  id: string;
  numero: string;
  dateFacture: Date | string;
  clientId: string;
  client?: Client;
  projetId?: string;
  statut: string; // brouillon | envoyee | payee | enRetard | annulee
  sousTotal: number;
  montantTPS: number;
  montantTVQ: number;
  totalTTC: number;
  conditionsPaiement?: string;
  lines?: InvoiceLine[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface InvoiceLine {
  id: string;
  factureId: string;
  facture?: Invoice;
  projetId?: string;
  projet?: Project;
  description: string;
  quantite: number;
  prixUnitaire: number;
  montantLigne: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string; // PENDING, COMPLETED, FAILED
  userId: string;
  user?: User;
  createdAt: Date | string;
}
