import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Query all users from the User table
  const users = await prisma.user.findMany();
  console.log(users); // This will print the result to the console
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Disconnect from the database
  });

