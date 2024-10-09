import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  
  const hashedPassword = await bcrypt.hash('TestPass1234', 10);

  await prisma.user.create({
    data: {
      email: 'hradmin@test.com',
      hashedPassword: hashedPassword,
      role: 'admin', 
    },
  });

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
