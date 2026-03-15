import 'dotenv/config'
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  // On pointe vers le dossier ou le fichier schema
  schema: './schema.prisma', 
  datasource: {
    url: env("DATABASE_URL"), // L'URL est définie ici maintenant !
  },
  migrations: {
    path: "../migrations",
  }
});