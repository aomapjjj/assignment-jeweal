import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      fullName: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('Seeded admin:', admin);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());