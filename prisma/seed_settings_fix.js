const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('⚙️  Starting Site Settings Fix...')

  // 1. Fetch existing settings
  const existingRecord = await prisma.siteSettings.findFirst()
  
  if (!existingRecord) {
      console.log('⚠️ No existing settings found. Please run screen_restore.js first or create initial settings.')
      return
  }

  const currentSettings = existingRecord.settings || {}
  console.log('✅ Found existing settings.')

  // 2. Define Defaults for Missing Sections
  const defaults = {
        about: {
            title: 'Tentang Desa Mata Mamplam',
            content: '<p>Deskripsi lengkap mengenai sejarah dan profil Desa Mata Mamplam...</p>',
            vision: 'Terwujudnya Desa Mata Mamplam yang maju, sejahtera, dan berdaya saing.',
            mission: ['Meningkatkan pelayanan publik', 'Mewujudkan tata kelola pemerintahan yang baik']
        },
        navigation: {
            externalLinks: []
        },
        geography: {
            location: 'Kecamatan Peusangan, Kabupaten Bireuen',
            area: '±500 Ha',
            boundaries: {
                north: 'Desa A',
                south: 'Desa B',
                east: 'Desa C',
                west: 'Desa D'
            },
            totalDusun: '4 Dusun'
        },
        // Ensure other sections exist too just in case
        faq: [],
        footer: {
             description: 'Website Resmi Pemerintah Gampong Mata Mamplam',
             socialMedia: {
                  facebook: 'https://facebook.com',
                  instagram: 'https://instagram.com',
                  twitter: 'https://twitter.com',
                  youtube: 'https://youtube.com'
             },
             copyright: '© 2026 Desa Mata Mamplam'
        }
  }

  // 3. Merge Logic: Only add if missing
  const updatedSettings = { ...currentSettings }

  if (!updatedSettings.about) {
      console.log('   + Adding missing "about" section')
      updatedSettings.about = defaults.about
  }

  if (!updatedSettings.navigation) {
      console.log('   + Adding missing "navigation" section')
      updatedSettings.navigation = defaults.navigation
  }

  if (!updatedSettings.geography) {
      console.log('   + Adding missing "geography" section')
      updatedSettings.geography = defaults.geography
  }

  if (!updatedSettings.faq) {
      console.log('   + Adding missing "faq" section')
      updatedSettings.faq = defaults.faq
  }
  
  // Ensure footer exists and has required fields
  if (!updatedSettings.footer) {
       updatedSettings.footer = defaults.footer
  }

  // 4. Update Database
  await prisma.siteSettings.update({
      where: { id: existingRecord.id },
      data: { settings: updatedSettings }
  })

  console.log('✅ Site Settings successfully patched!')
}

main()
  .catch((e) => {
    console.error('❌ Error fixing settings:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
