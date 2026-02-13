
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Village Organizational Structure...');

  // 1. Clear existing structure data to avoid duplicates/conflicts
  // We delete officials first (due to foreign key), then positions
  await prisma.villageOfficial.deleteMany({});
  await prisma.villageOfficialPosition.deleteMany({});
  
  console.log('🧹 Cleared existing structure data');

  // Define the structure hierarchy
  // Level 1: Leadership
  // Level 2: Advisory (Tuha Peut, Tuha Lapan, Imum)
  // Level 4: Secretariat (Sekdes, Kaur)
  // Level 5: Technical (Kasi)
  // Level 6: Regional (Kadus)

  const positions = [
    // --- LEVEL 1 (Leadership) ---
    {
      category: 'LEADERSHIP',
      positionKey: 'KEUCHIK',
      positionName: 'Keuchik',
      level: 1,
      sortOrder: 1,
      officialName: 'Taufik, ST',
    },

    // --- LEVEL 2 (Advisory/Religious) ---
    // Note: Tuha Lapan is often synonymous or alongside Tuha Peut in Aceh structure
    {
      category: 'ADVISORY',
      positionKey: 'TUHA_PEUT_KETUA',
      positionName: 'Ketua Tuha Peut',
      level: 2,
      sortOrder: 1,
      officialName: 'Zulkifli, SST., MT',
    },
    {
      category: 'ADVISORY',
      positionKey: 'TUHA_LAPAN_KETUA',
      positionName: 'Ketua Tuha Lapan', // As requested in image diagram
      level: 2,
      sortOrder: 2,
      officialName: 'Abdurrahman',
    },
    {
      category: 'RELIGIOUS',
      positionKey: 'IMUM_GAMPONG',
      positionName: 'Imum Gampong',
      level: 2,
      sortOrder: 3,
      officialName: 'Tgk. M. Nasir',
    },

    // --- LEVEL 4 (Secretariat - Sekdes & Kaur) ---
    {
      category: 'SECRETARIAT',
      positionKey: 'SEKDES',
      positionName: 'Sekretaris Desa',
      level: 4,
      sortOrder: 1,
      officialName: 'Mirza Maladi, A.Md',
    },
    {
      category: 'SECRETARIAT',
      positionKey: 'KAUR_UMUM',
      positionName: 'Kaur Umum & Perencanaan',
      level: 4,
      sortOrder: 2,
      officialName: 'Abdul Muthalib',
    },
    {
      category: 'SECRETARIAT',
      positionKey: 'KAUR_KEUANGAN',
      positionName: 'Kaur Keuangan',
      level: 4,
      sortOrder: 3,
      officialName: 'Saifannur, S.Pd',
    },

    // --- LEVEL 5 (Technical - Kasi) ---
    {
      category: 'TECHNICAL',
      positionKey: 'KASI_PEMERINTAHAN',
      positionName: 'Kasi Pemerintahan',
      level: 5,
      sortOrder: 1,
      officialName: 'Asrizal, S.Kom',
    },
    {
      category: 'TECHNICAL',
      positionKey: 'KASI_PEMBANGUNAN',
      positionName: 'Kasi Pembangunan',
      level: 5,
      sortOrder: 2,
      officialName: 'Azhari Ibrahim',
    },
    {
      category: 'TECHNICAL',
      positionKey: 'KASI_KEISTIMEWAAN',
      positionName: 'Kasi Keistimewaan',
      level: 5,
      sortOrder: 3,
      officialName: 'Tgk. Mhd. Roum',
    },

    // --- LEVEL 6 (Regional - Kadus) ---
    {
      category: 'DUSUN',
      positionKey: 'KADUS_KULAM',
      positionName: 'Petua Dusun Kulam',
      level: 6,
      sortOrder: 1,
      officialName: 'Jafar Abu',
      dusunName: 'Dusun Kulam',
    },
    {
      category: 'DUSUN',
      positionKey: 'KADUS_MUDA_INTAN',
      positionName: 'Petua Dusun Muda Intan',
      level: 6,
      sortOrder: 2,
      officialName: 'Zamzami, S.Pd',
      dusunName: 'Dusun Muda Intan',
    },
    {
      category: 'DUSUN',
      positionKey: 'KADUS_BALE_SEUTUI',
      positionName: 'Petua Dusun Bale Seutui',
      level: 6,
      sortOrder: 3,
      officialName: 'Agus Rinaldi',
      dusunName: 'Dusun Bale Seutui',
    },
  ];

  for (const pos of positions) {
    // 1. Create Position
    const position = await prisma.villageOfficialPosition.create({
      data: {
        category: pos.category,
        positionKey: pos.positionKey,
        positionName: pos.positionName,
        level: pos.level,
        sortOrder: pos.sortOrder,
        dusunName: pos.dusunName,
      },
    });

    // 2. Create Official assigned to this position
    await prisma.villageOfficial.create({
      data: {
        positionId: position.id,
        name: pos.officialName,
        phone: '-', // Placeholder as it's required but maybe not known yet
        address: 'Mata Mamplam', // Placeholder
        isActive: true,
        startDate: new Date(),
        // No photo for now, will use initials fallback
      },
    });

    console.log(`✅ Created: ${pos.positionName} - ${pos.officialName}`);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
