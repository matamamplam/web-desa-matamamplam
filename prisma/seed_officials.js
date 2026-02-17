const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🏛️  Seeding 2026 Organizational Structure...')

  // ============================================
  // ORGANIZATIONAL STRUCTURE (VILLAGE OFFICIALS)
  // ============================================
  // Updated based on 2026 Organization Chart
  
  // Clear existing to ensure clean slate for hierarchy
  // This ensures we don't have duplicate positions or conflicts when re-running
  console.log('🧹 Clearing existing officials data...')
  try {
    await prisma.villageOfficial.deleteMany({})
    await prisma.villageOfficialPosition.deleteMany({})
  } catch (e) {
    console.warn('⚠️ Warning clearing tables:', e.message)
  }

  const positions = [
      // ADVISORY / LEGISLATIVE
      { key: 'TUHA_LAPAN', name: 'Tuha Lapan', level: 1, sort: 1, category: 'ADVISORY', official: 'Abdurrahman' },
      { key: 'TUHA_PEUT', name: 'Tuha Peut', level: 1, sort: 2, category: 'ADVISORY', official: 'Zulkifli, SST.,MT' },
      
      // EXECUTIVE LEADERSHIP
      { key: 'KEUCHIK', name: 'Keuchik Gampong', level: 1, sort: 3, category: 'LEADERSHIP', official: 'Taufiq, ST' },
      { key: 'IMUM_GAMPONG', name: 'Imum Gampong', level: 1, sort: 4, category: 'RELIGIOUS', official: 'Tgk. M. Nasir' },
      
      // SECRETARIAT
      { key: 'SEKDES', name: 'Sekretaris Desa', level: 2, sort: 1, category: 'SECRETARIAT', official: 'Mirza Maladi, A.Md' },
      
      // KAUR & KASI (Level 3 - Sorted Left to Right as per Image)
      // Order: Kasi Keis, Kasi Pemb, Kaur Umum, Kaur Keuangan, Kasi Pem
      { key: 'KASI_KEISTIMEWAAN', name: 'Kasi Keistimewaan', level: 3, sort: 1, category: 'TECHNICAL', official: 'Tgk. Mhd. Roum' },
      { key: 'KASI_PEMBANGUNAN', name: 'Kasi Pembangunan', level: 3, sort: 2, category: 'TECHNICAL', official: 'Azhari Ibrahim' },
      { key: 'KAUR_UMUM', name: 'Kaur Umum & Perencanaan', level: 3, sort: 3, category: 'SECRETARIAT', official: 'Abdul Muthalib' },
      { key: 'KAUR_KEUANGAN', name: 'Kaur Keuangan', level: 3, sort: 4, category: 'SECRETARIAT', official: 'Saifannur, S.Pd' },
      { key: 'KASI_PEMERINTAHAN', name: 'Kasi Pemerintahan', level: 3, sort: 5, category: 'TECHNICAL', official: 'Asrizal, S.Kom' },
      
      // DUSUN (Territorial)
      { key: 'KADUS_KULAM', name: 'Petua Dusun Kulam', level: 4, sort: 1, category: 'DUSUN', dusun: 'Dusun Kulam', official: 'Jafar Abu' },
      { key: 'KADUS_MUDA_INTAN', name: 'Petua Dusun Muda Intan', level: 4, sort: 2, category: 'DUSUN', dusun: 'Dusun Muda Intan', official: 'Zamzami, S.Pd' }, 
      { key: 'KADUS_BALE_SEUTUI', name: 'Petua Dusun Bale Seutui', level: 4, sort: 3, category: 'DUSUN', dusun: 'Dusun Bale Seutui', official: 'Agus Rinaldi' },
  ]

  for (const pos of positions) {
      console.log(`   ➕ Creating position: ${pos.name} (${pos.official})`)
      const position = await prisma.villageOfficialPosition.create({
          data: {
              category: pos.category,
              positionKey: pos.key,
              positionName: pos.name,
              level: pos.level,
              sortOrder: pos.sort,
              dusunName: pos.dusun
          }
      })

      // Assign official
      await prisma.villageOfficial.create({
          data: {
              positionId: position.id,
              name: pos.official,
              phone: '0812xxxxxxxx', // Placeholder
              address: 'Mata Mamplam',
              isActive: true
          }
      })
  }
  console.log(`✅ Successfully seeded ${positions.length} Village Officials!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding officials:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
