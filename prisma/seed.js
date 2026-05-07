require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing teams...');
  await prisma.team.deleteMany();
  
  console.log('Seeding new teams from Astra list...');
  await prisma.team.createMany({
    data: [
      { name: 'PASHUPATASTRA', owner: 'Admin', budgetRemaining: 10000 },
      { name: 'TRISHULA', owner: 'Admin', budgetRemaining: 10000 },
      { name: 'BRAMHASTRA', owner: 'Admin', budgetRemaining: 10000 },
      { name: 'RUDRASTRA', owner: 'Admin', budgetRemaining: 10000 },
      { name: 'GARUDASTRA', owner: 'Admin', budgetRemaining: 10000 },
      { name: 'PARASHU', owner: 'Admin', budgetRemaining: 10000 },
      { name: 'VAJRA', owner: 'Admin', budgetRemaining: 10000 },
      { name: 'SUDARSHANA', owner: 'Admin', budgetRemaining: 10000 },
    ]
  });
  console.log('Teams seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
