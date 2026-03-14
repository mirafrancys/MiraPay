const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const defaultRoles = [
    { name: 'ADMIN', description: 'Administrateur système' },
    { name: 'USER', description: 'Utilisateur standard' },
    { name: 'MANAGER', description: 'Gestionnaire' },
  ];

  for (const role of defaultRoles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  if (adminRole) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@mirapay.com' },
      update: {},
      create: {
        email: 'admin@mirapay.com',
        username: 'admin',
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Admin',
        roleId: adminRole.id
      }
    });
  }

  console.log('Database seeded with roles and admin user.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
