import type {
  IRole,
  IUser,
  IClient,
} from './shared-models';

describe('shared-models', () => {
  it('should export all required interfaces (compile-time check)', () => {
    // Ce test sert de vérification statique : si une interface est retirée
    // ou renommée dans shared-models.ts, ce fichier ne compilera plus,
    // ce qui déclenchera une erreur lors du typecheck ou du build.
    const _typeCheck = true;
    expect(_typeCheck).toBe(true);
  });

  it('should allow creating a valid IRole object', () => {
    const role: IRole = {
      id: '1',
      name: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(role.name).toBe('ADMIN');
  });

  it('should allow creating a valid IUser object', () => {
    const user: IUser = {
      id: '1',
      username: 'jdoe',
      email: 'jdoe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(user.email).toBe('jdoe@example.com');
  });

  it('should allow creating a valid IClient object', () => {
    const client: IClient = {
      id: '1',
      typeClient: 'entreprise',
      nomLegal: 'Acme Corp',
      adresseLigne1: '123 Rue Principale',
      ville: 'Montréal',
      province: 'QC',
      codePostal: 'H1A 1A1',
      pays: 'Canada',
      courriel: 'info@acme.com',
      telephone: '514-555-0000',
      modeFacturationParDefaut: 'horaire',
      deviseParDefaut: 'CAD',
      clientTaxable: true,
      appliquerTPS: true,
      appliquerTVQ: true,
      estArchive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(client.nomLegal).toBe('Acme Corp');
  });
});
