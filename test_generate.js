const { execSync } = require('child_process');
const fs = require('fs');

try {
  process.env.DATABASE_URL = "postgresql://dummy:dummy@localhost:5432/mira_pay";
  const output = execSync('npx -y prisma validate', { encoding: 'utf-8' });
  fs.writeFileSync('output_prisma_success.txt', output);
} catch (error) {
  fs.writeFileSync('output_prisma_error.txt', error.toString() + "\n" + (error.stdout || "") + "\n" + (error.stderr || ""));
}
