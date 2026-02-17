
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const quakes = await prisma.earthquake.findMany();
  console.log('Total Earthquakes:', quakes.length);
  console.log('Sample Data:', quakes.slice(0, 3));
  
  const acehQuakes = await prisma.earthquake.findMany({
    where: {
        location: {
            contains: 'Aceh',
            mode: 'insensitive'
        }
    }
  });
  console.log('Aceh Earthquakes:', acehQuakes.length);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
