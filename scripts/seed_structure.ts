import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const positions = [
  // Level 1: Leadership
  {
    category: 'LEADERSHIP',
    positionKey: 'KEUCHIK',
    positionName: 'Keuchik / Geuchik (Kepala Gampong)',
    level: 1,
    sortOrder: 1,
  },

  // Level 2: Advisory & Religious
  {
    category: 'ADVISORY',
    positionKey: 'TUHA_PEUT',
    positionName: 'Tuha Peuët',
    level: 2,
    sortOrder: 1,
  },
  {
    category: 'RELIGIOUS',
    positionKey: 'IMUM_GAMPONG',
    positionName: 'Imum Gampong / Imeum',
    level: 2,
    sortOrder: 2,
  },

  // Level 3: Community Organizations
  {
    category: 'ADVISORY',
    positionKey: 'LEMBAGA_ADAT',
    positionName: 'Lembaga Adat',
    level: 3,
    sortOrder: 1,
  },
  {
    category: 'ADVISORY',
    positionKey: 'TUHA_LAPAN',
    positionName: 'Lembaga Tuha Lapan',
    level: 3,
    sortOrder: 2,
  },

  // Level 4: Secretariat Head
  {
    category: 'SECRETARIAT',
    positionKey: 'SEKDES',
    positionName: 'Sekretaris Gampong',
    level: 4,
    sortOrder: 1,
  },

  // Level 5: Department Heads
  {
    category: 'SECRETARIAT',
    positionKey: 'KASI_PEMERINTAHAN',
    positionName: 'Kasi Pemerintahan',
    level: 5,
    sortOrder: 1,
  },
  {
    category: 'SECRETARIAT',
    positionKey: 'KASI_PEMBANGUNAN',
    positionName: 'Kasi Pembangunan',
    level: 5,
    sortOrder: 2,
  },
  {
    category: 'SECRETARIAT',
    positionKey: 'KASI_KESEJAHTERAAN',
    positionName: 'Kasi Kesejahteraan / Pelayanan Masyarakat',
    level: 5,
    sortOrder: 3,
  },
  {
    category: 'SECRETARIAT',
    positionKey: 'KAUR_KEUANGAN',
    positionName: 'Kaur Keuangan',
    level: 5,
    sortOrder: 4,
  },

  // Level 6: Dusun Heads (examples - can be customized)
  {
    category: 'DUSUN',
    positionKey: 'DUSUN_1',
    positionName: 'Kepala Dusun',
    level: 6,
    sortOrder: 1,
    dusunName: 'Dusun I',
  },
  {
    category: 'DUSUN',
    positionKey: 'DUSUN_2',
    positionName: 'Kepala Dusun',
    level: 6,
    sortOrder: 2,
    dusunName: 'Dusun II',
  },
];

async function main() {
  console.log('Seeding village organizational structure positions...\n');

  // Check if positions already exist
  const existingCount = await prisma.villageOfficialPosition.count();
  
  if (existingCount > 0) {
    console.log(`⚠️  Found ${existingCount} existing positions. Skipping seed.`);
    console.log('   To reseed, delete existing positions first.\n');
    return;
  }

  // Create all positions
  for (const position of positions) {
    const created = await prisma.villageOfficialPosition.create({
      data: position,
    });
    console.log(`✓ Created position: ${created.positionName} (${created.positionKey})`);
  }

  console.log(`\n✅ Successfully seeded ${positions.length} positions!`);
  console.log('\nStructure hierarchy:');
  console.log('  Level 1: Keuchik');
  console.log('  Level 2: Tuha Peuët, Imum Gampong');
  console.log('  Level 3: Lembaga Adat, Lembaga Tuha Lapan');
  console.log('  Level 4: Sekretaris Gampong');
  console.log('  Level 5: Kasi Pemerintahan, Kasi Pembangunan, Kasi Kesejahteraan, Kaur Keuangan');
  console.log('  Level 6: Kepala Dusun I, Kepala Dusun II');
  console.log('\n💡 Tip: You can add more Kepala Dusun positions from the admin panel.\n');
}

main()
  .catch((e) => {
    console.error('Error seeding village structure:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
