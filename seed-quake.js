
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.earthquake.deleteMany({}); // clear old data
  await prisma.earthquake.create({
    data: {
      datetime: new Date().toISOString(),
      date: '17 Feb 2026',
      time: '12:30:00 WIB',
      coordinates: '5.55,95.32',
      lintang: '5.55 LU',
      bujur: '95.32 BT',
      magnitude: '5.2',
      depth: '10 km',
      location: '20 km BaratDaya BANDAACEH-ACEH',
      potential: 'Tidak berpotensi Tsunami',
      shakemap: 'https://data.bmkg.go.id/DataMKG/TEWS/20260217123000.mmi.jpg' // dummy
    }
  });
  console.log('Seeded Aceh Earthquake');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
