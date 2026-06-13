import prisma from '../prisma-client';
import { Invoice, Prisma } from '@mirapay/prisma';
import { HttpError } from '../utils/http-error';

export interface InvoiceLineInput {
  description: string;
  quantite: number;
  prixUnitaire: number;
  montantLigne: number;
  projetId?: string;
  timeEntryIds?: string[];
}

export interface DraftInvoice {
  numero: string;
  clientId: string;
  projetId: string | null;
  statut: string;
  sousTotal: number;
  montantTPS: number;
  montantTVQ: number;
  totalTTC: number;
  lines: InvoiceLineInput[];
}

export class InvoicesService {
  async create(data: Prisma.InvoiceUncheckedCreateInput & { lines: InvoiceLineInput[] }, timeEntryIds: string[]): Promise<Invoice> {
    // 8.1.3 : Exigence transactionnelle pour verrouillage des entrées de temps
    return prisma.$transaction(async (tx) => {
      
      // 1. Extraire les lignes pour traitement imbriqué Prisma
      const { lines, ...invoiceData } = data;

      // 2. Créer la facture avec ses lignes
      const invoice = await tx.invoice.create({
        data: {
          ...invoiceData,
          lines: {
            create: lines.map(line => ({
              description: line.description,
              quantite: line.quantite,
              prixUnitaire: line.prixUnitaire,
              montantLigne: line.montantLigne,
              projetId: line.projetId,
              timeEntries: line.timeEntryIds ? {
                connect: line.timeEntryIds.map((id: string) => ({ id }))
              } : undefined
            }))
          }
        }
      });

      // 3. Basculer les entrées de temps au statut 'facture'
      if (timeEntryIds && timeEntryIds.length > 0) {
        await tx.timeEntry.updateMany({
          where: { id: { in: timeEntryIds } },
          data: { statut: 'facture' }
        });
      }

      return invoice;
    });
  }

  // 6.5.1 : Écran de préparation de facture (Simulation)
  async prepareDraft(clientId: string, projetId?: string, options: { dateDebut?: string; dateFin?: string } = {}): Promise<DraftInvoice> {
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) throw new Error('Client non trouvé');

    const where: Prisma.TimeEntryWhereInput = {
      statut: 'approuve',
      estFacturable: true,
      projet: { clientId }
    };

    if (projetId) where.projetId = projetId;

    if (options.dateDebut || options.dateFin) {
      where.date = {};
      if (options.dateDebut) where.date.gte = new Date(options.dateDebut);
      if (options.dateFin) where.date.lte = new Date(options.dateFin);
    }

    const unbilledEntries = await prisma.timeEntry.findMany({
      where,
      include: { projet: true }
    });

    if (unbilledEntries.length === 0) {
      throw new Error('Aucune entrée de temps approuvée et facturable trouvée pour cette période.');
    }

    // Regrouper par projet
    const lines: InvoiceLineInput[] = [];
    let subTotal = 0;

    // Récupérer la liste des projets touchés
    const projectIds = [...new Set(unbilledEntries.map(e => e.projetId))];

    for (const pid of projectIds) {
      const entries = unbilledEntries.filter(e => e.projetId === pid);
      const project = entries[0].projet;
      const totalHours = entries.reduce((sum, entry) => sum + entry.dureeHeures, 0);
      const rate = project.tauxHoraire || 0;
      const amount = totalHours * rate;

      subTotal += amount;

      lines.push({
        projetId: pid,
        description: `Honoraires - Projet : ${project.nom} (${totalHours} heures)`,
        quantite: totalHours,
        prixUnitaire: rate,
        montantLigne: amount,
        timeEntryIds: entries.map(e => e.id)
      });
    }

    // Calcul Taxes selon paramètres client (Règle 6.4.3)
    const tpsRate = client.appliquerTPS ? 0.05 : 0; 
    const tvqRate = client.appliquerTVQ ? 0.09975 : 0; 

    const tps = subTotal * tpsRate;
    const tvq = subTotal * tvqRate;
    const total = subTotal + tps + tvq;

    // Numérotation séquentielle brute
    const count = await prisma.invoice.count();
    const numero = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return {
      numero,
      clientId,
      projetId: projetId || null,
      statut: 'brouillon',
      sousTotal: subTotal,
      montantTPS: tps,
      montantTVQ: tvq,
      totalTTC: total,
      lines
    };
  }

  async findAll(): Promise<Invoice[]> {
    return prisma.invoice.findMany({
      include: { client: { select: { nomLegal: true } } },
      orderBy: { dateFacture: 'desc' }
    });
  }

  async findOne(id: string): Promise<Invoice | null> {
    return prisma.invoice.findUnique({
      where: { id },
      include: { client: true, lines: true }
    });
  }

  async updateStatus(id: string, statut: string): Promise<Invoice> {
    const inv = await prisma.invoice.findUnique({ where: { id } });
    if (inv && inv.statut === 'annulee') {
      throw new HttpError(400, "Une facture au statut 'annulee' ne peut plus être modifiée.");
    }
    return prisma.invoice.update({ where: { id }, data: { statut } });
  }
}
