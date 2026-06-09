export interface IRole {
  id: string;
  name: string; // ex: ADMIN, CUSTOMER, SUPPORT
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IUser {
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
  role?: IRole;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IClient {
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
  bankHours?: IBankHour[];
  contacts?: IContact[];
  soumissions?: ISoumission[];
  contrats?: IContrat[];
  _count?: { projects: number; invoices: number; };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IClientContact {
  id?: string;
  clientId: string;
  nom: string;
  fonction?: string;
  courriel?: string;
  telephone?: string;
}

export interface IProject {
  id: string;
  clientId: string;
  client?: IClient;
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
  bankHours?: IBankHour[];
  contratId?: string;
  contrat?: IContrat;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ITask {
  id: string;
  projetId: string;
  projet?: IProject;
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

export interface ITaskNote {
  id: string;
  tacheId: string;
  tache?: ITask;
  userId: string;
  user?: IUser;
  contenu: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ITimeEntry {
  id: string;
  userId: string;
  user?: IUser;
  date: Date | string;
  projetId: string;
  projet?: IProject;
  tacheId?: string;
  tache?: ITask;
  dureeHeures: number;
  estFacturable: boolean;
  commentaire?: string;
  statut: string; // brouillon | approuve | facture
  bankHourId?: string;
  bankHour?: IBankHour;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IInvoice {
  id: string;
  numero: string;
  dateFacture: Date | string;
  clientId: string;
  client?: IClient;
  projetId?: string;
  statut: string; // brouillon | envoyee | payee | enRetard | annulee
  sousTotal: number;
  montantTPS: number;
  montantTVQ: number;
  totalTTC: number;
  conditionsPaiement?: string;
  lines?: IInvoiceLine[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IInvoiceLine {
  id: string;
  factureId: string;
  facture?: IInvoice;
  projetId?: string;
  projet?: IProject;
  description: string;
  quantite: number;
  prixUnitaire: number;
  montantLigne: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ITransaction {
  id: string;
  amount: number;
  currency: string;
  status: string; // PENDING, COMPLETED, FAILED
  userId: string;
  user?: IUser;
  createdAt: Date | string;
}

export interface IBankHour {
  id: string;
  clientId: string;
  client?: IClient;
  projetId?: string;
  projet?: IProject;
  nom: string;
  description?: string;
  heuresAchetees: number;
  heuresConsommees: number;
  dateDebut?: Date | string;
  dateFin?: Date | string;
  estActive: boolean;
  timeEntries?: ITimeEntry[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IContact {
  id: string;
  clientId: string;
  client?: IClient;
  nom: string;
  fonction?: string;
  courriel?: string;
  telephone?: string;
  estActive: boolean;
  soumissions?: ISoumission[];
  contrats?: IContrat[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ISoumission {
  id: string;
  numero: string;
  dateSoumission: Date | string;
  clientId: string;
  client?: IClient;
  contactId?: string;
  contact?: IContact;
  titre: string;
  description?: string;
  dateValidite?: Date | string;
  statut: string; // brouillon | envoyee | acceptee | refusee | expiree
  sousTotalHT: number;
  montantTPS: number;
  montantTVQ: number;
  totalTTC: number;
  lines?: ISoumissionLine[];
  contrats?: IContrat[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ISoumissionLine {
  id: string;
  soumissionId: string;
  soumission?: ISoumission;
  description: string;
  quantite: number;
  prixUnitaire: number;
  montantLigne: number;
  typeLigne: string; // service | materiel | autre
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IContrat {
  id: string;
  numero: string;
  dateSignature?: Date | string;
  dateDebut: Date | string;
  dateFin?: Date | string;
  clientId: string;
  client?: IClient;
  contactId?: string;
  contact?: IContact;
  soumissionId?: string;
  soumission?: ISoumission;
  statut: string; // actif | suspendu | termine | archive
  montantTotalContrat?: number;
  typeContrat: string; // horaire | forfait | banqueHeures | mixte;
  conditionsSpeciales?: string;
  projects?: IProject[];
  createdAt: Date | string;
  updatedAt: Date | string;
}
