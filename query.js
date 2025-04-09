import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Query all users from the User table with the theme field included
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      theme: true,  // Ensure theme is included in the query
      socialPosition: true,  // Include other fields if needed
    },
  });

  console.log(users); // This will print the result with the selected fields to the console
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Disconnect from the database
  });

