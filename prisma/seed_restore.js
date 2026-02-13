const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Data Restoration from Backup...')

  // 1. Read Backup File
  const backupPath = path.join(__dirname, '..', 'backup_full.json')
  if (!fs.existsSync(backupPath)) {
    throw new Error('Backup file not found at: ' + backupPath)
  }
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  console.log('✅ Loaded backup_full.json')

  // 2. Clear tables that will be replaced by new feature seeds (But be careful with Settings)
  // We want to use the NEW structure for these, not the old backup data
  console.log('🧹 Clearing structure data...')
  try {
    // await prisma.siteSettings.deleteMany({}) // DON'T DELETE SETTINGS YET, we need to merge
    await prisma.villageOfficial.deleteMany({})
    await prisma.villageOfficialPosition.deleteMany({})
    // We keep DisasterEvent for now, or maybe clear it too if we want a fresh start?
    // User said "sesuaikan dengan system terbaru", so fresh logic for new features is better.
    // However, we shouldn't delete USER data or LETTER REQUESTS.
  } catch (e) {
    console.warn('⚠️ Minor warning clearing tables:', e.message)
  }

  // 3. Restore Core Data (Users, Population, Content)
  // function to restore generic models
  const safeRestore = async (modelName, data, uniqueKey = 'id') => {
    if (!data || data.length === 0) return
    console.log(`📥 Restoring ${modelName} (${data.length} items)...`)
    
    for (const item of data) {
      try {
        // Remove relationships that might cause issues if referenced data doesn't exist yet
        // For strict restoration, we might need topological sort, but upsert usually handles simple cases
        // We'll rely on the backup having valid data.
        
        /* 
           NOTE: We must be careful with Foreign Keys. 
           Order matters: User -> KK -> Penduduk -> others
        */

        // Clean up item (remove null IDs if any, though backup usually has them)
        // Prisma upsert requires 'where' clause.
        
        // Dynamic upsert
        const where = {}
        where[uniqueKey] = item[uniqueKey]

        // Strip relations (arrays) and null IDs to prevent FK errors
        const cleanItem = { ...item }
        Object.keys(cleanItem).forEach(key => {
            if (Array.isArray(cleanItem[key]) || (typeof cleanItem[key] === 'object' && cleanItem[key] !== null && !(cleanItem[key] instanceof Date))) {
                 // Check if it's a relation object (not Date or null)
                 // Start with simple array check (One-to-Many)
                delete cleanItem[key] // Remove nested relations or relation objects
            }
            // The original code had this, but the above condition covers arrays.
            // If there are other types of relations that are not arrays or objects (e.g., just IDs), they should be fine.
            // if (Array.isArray(cleanItem[key])) {
            //     delete cleanItem[key] // Remove nested relations
            // }
            if (cleanItem[key] === null && key !== 'avatar' && key !== 'description') {
                // Optional: keep nulls for fields that allow it, but relationships like 'dusun' might be null
                // safely keeping null scalar fields is usually fine.
            }
        })
        
        // Specific cleanup for User to remove letterRequests relation if present as object/array
        if (modelName === 'user') {
            delete cleanItem.letterRequests
            delete cleanItem.proposals
            delete cleanItem.complaints
            delete cleanItem.news
        }

        // Specific transformation for Letter Templates: Remove BOLD formatting from placeholders
        if (modelName === 'letterTemplate' && cleanItem.template) {
            // Regex to match <b>{{...}}</b>, <strong>{{...}}</strong>, or <span style="font-weight: bold">{{...}}</span>
            // and replace with just the {{...}} content
            
            let temp = cleanItem.template
            
            // 1. Remove <b>{{variable}}</b> -> {{variable}}
            temp = temp.replace(/<b>\s*({{.*?}})\s*<\/b>/gi, '$1')
            
            // 2. Remove <strong>{{variable}}</strong> -> {{variable}}
            temp = temp.replace(/<strong>\s*({{.*?}})\s*<\/strong>/gi, '$1')
            
            // 3. Remove inline style bold spans: <span style="...font-weight: bold...">{{variable}}</span>
            // This is trickier regex, but let's try a simple one for common case
            temp = temp.replace(/<span[^>]*style="[^"]*font-weight:\s*bold[^"]*"[^>]*>\s*({{.*?}})\s*<\/span>/gi, '$1')
            
            cleanItem.template = temp
            console.log(`   - Unbolded placeholders for template: ${cleanItem.name}`)
        }

        await prisma[modelName].upsert({
            where: where,
            update: cleanItem, 
            create: cleanItem
        })
      } catch (e) {
        console.warn(`⚠️ Failed to restore ${modelName} ${item[uniqueKey]}: ${e.message}`)
      }
    }
  }

  // Restore in dependency order
  await safeRestore('user', backup.user)
  await safeRestore('kartuKeluarga', backup.kartuKeluarga)
  await safeRestore('penduduk', backup.penduduk, 'id') // Penduduk needs KK
  
  // Restore Content
  await safeRestore('newsCategory', backup.newsCategory)
  await safeRestore('news', backup.news)
  
  await safeRestore('uMKMCategory', backup.uMKMCategory)
  await safeRestore('uMKM', backup.uMKM, 'slug') // Use slug for UMKM if id fails? Backup has ID.
  // Note: backup.uMKM items might contain "products" array which Prisma create handles, 
  // but if we do raw upsert with JSON data that includes relation arrays, it might fail if not formatted for create.
  // A simple backup dump often includes relations as arrays. 
  // If it includes relations, we might need to strip them.
  // For now, assuming backup is standard Prisma dump (flat-ish or includes ids).

  // Restore Letters
  await safeRestore('letterTemplate', backup.letterTemplate)
  // letterRequests depend on inhabitants and templates
  await safeRestore('letterRequest', backup.letterRequest) 

  // ============================================
  // SPECIAL HANDLING: SITE SETTINGS (MERGE BACKUP + NEW DEFAULTS)
  // ============================================
  console.log('⚙️ Merging Site Settings...')
  const backupSettings = backup.siteSettings && backup.siteSettings.length > 0 ? backup.siteSettings[0] : null
  
  // Default New Settings Structure
  const defaultSettings = {
        siteName: 'Desa Mata Mamplam',
        siteDescription: 'Website Resmi Pemerintah Gampong Mata Mamplam',
        contactEmail: 'matamamplam2026@gmail.com',
        contactPhone: '081234567890',
        address: 'Jalan Cot Ijue, Kecamatan Peusangan',
        socialMedia: {
            facebook: 'https://facebook.com',
            instagram: 'https://instagram.com',
            twitter: 'https://twitter.com',
            youtube: 'https://youtube.com'
        },
        features: {
            enableComments: true,
            enablePublicComplaints: true,
            enableSurveys: false
        },
        general: {
            siteName: 'Desa Mata Mamplam',
            tagline: 'Maju, Sejahtera, Islami',
            description: 'Website Resmi Pemerintah Gampong Mata Mamplam',
            heroBackground: ''
        },
        branding: {
            logo: '',
            letterLogo: '',
            favicon: ''
        },
        contact: {
            email: 'matamamplam2026@gmail.com',
            phone: '081234567890',
            whatsapp: '081234567890',
            address: 'Jalan Cot Ijue, Kecamatan Peusangan',
            mapUrl: '',
            operationalHours: {
                weekdays: '08:00 - 16:00',
                saturday: '08:00 - 12:00',
                sunday: 'Tutup'
            }
        },
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
        },
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
        }
  }

  // Merge logic: If backup has settings, try to preserve images/branding
  let finalSettings = defaultSettings
  
  if (backupSettings && backupSettings.settings) {
      console.log('   Found backup settings, merging...')
      const old = backupSettings.settings
      
      // Attempt to map old structure to new if possible, or just overlay matching keys
      // Assuming old structure was somewhat similar or we extract specific fields
      
      // Preserve Images if they exist in old settings (checking common paths)
      if (old.branding?.logo) finalSettings.branding.logo = old.branding.logo
      if (old.branding?.favicon) finalSettings.branding.favicon = old.branding.favicon
      if (old.general?.heroBackground) finalSettings.general.heroBackground = old.general.heroBackground
      if (old.contact?.mapUrl) finalSettings.contact.mapUrl = old.contact.mapUrl
      
      // Also try to preserve text
      if (old.general?.siteName) finalSettings.general.siteName = old.general.siteName
      if (old.general?.tagline) finalSettings.general.tagline = old.general.tagline
      if (old.general?.description) finalSettings.general.description = old.general.description

      // Preserve contact info
      if (old.contact?.email) finalSettings.contact.email = old.contact.email
      if (old.contact?.phone) finalSettings.contact.phone = old.contact.phone
      if (old.contact?.whatsapp) finalSettings.contact.whatsapp = old.contact.whatsapp
      if (old.contact?.address) finalSettings.contact.address = old.contact.address

      // Preserve social media links (merge, don't overwrite entirely)
      if (old.socialMedia) {
          finalSettings.socialMedia = { ...finalSettings.socialMedia, ...old.socialMedia }
      }
      if (old.footer?.socialMedia) {
          finalSettings.footer.socialMedia = { ...finalSettings.footer.socialMedia, ...old.footer.socialMedia }
      }

      // Preserve footer description and copyright
      if (old.footer?.description) finalSettings.footer.description = old.footer.description
      if (old.footer?.copyright) finalSettings.footer.copyright = old.footer.copyright

      // Preserve features
      if (old.features) {
          finalSettings.features = { ...finalSettings.features, ...old.features }
      }

      // Preserve About
      if (old.about) {
          finalSettings.about = { ...finalSettings.about, ...old.about }
      }

      // Preserve Navigation
      if (old.navigation) {
          finalSettings.navigation = { ...finalSettings.navigation, ...old.navigation }
      }

      // Preserve Geography
      if (old.geography) {
          finalSettings.geography = { ...finalSettings.geography, ...old.geography }
      }
  }

  // Upsert Settings
  // Actually, wait, upsert needs a valid where. `siteSettings` usually has an ID.
  // The backup item has an ID.
  if (backupSettings) {
      await prisma.siteSettings.upsert({
          where: { id: backupSettings.id },
          create: { id: backupSettings.id, settings: finalSettings },
          update: { settings: finalSettings }
      })
  } else {
      // Create new if no backup
       await prisma.siteSettings.create({
          data: { settings: finalSettings }
      })
  }
  console.log('✅ Merged and restored Site Settings')
  // ============================================
  // 4. SEED NEW FEATURES (From Standard Seed)
  // ============================================
  console.log('🆕 Seeding New Features (Officials, Settings, Disaster)...')

  // ... [PASTE SEED.JS LOGIC HERE FOR NEW FEATURES] ...
  
    // ============================================
  // ORGANIZATIONAL STRUCTURE (VILLAGE OFFICIALS)
  // ============================================
  // Updated based on 2026 Organization Chart
  
  // Clear existing to ensure clean slate for hierarchy
  await prisma.villageOfficial.deleteMany({})
  await prisma.villageOfficialPosition.deleteMany({})

  const positions = [
      // ADVISORY / LEGISLATIVE
      { key: 'TUHA_LAPAN', name: 'Tuha Lapan', level: 1, sort: 1, category: 'ADVISORY', official: 'Abdurrahman' },
      { key: 'TUHA_PEUT', name: 'Tuha Peut', level: 1, sort: 2, category: 'ADVISORY', official: 'Zulkifli, SST.,MT' },
      
      // EXECUTIVE LEADERSHIP
      { key: 'KEUCHIK', name: 'Keuchik Gampong', level: 1, sort: 3, category: 'LEADERSHIP', official: 'Taufik, ST' },
      { key: 'IMUM_GAMPONG', name: 'Imum Gampong', level: 1, sort: 4, category: 'RELIGIOUS', official: 'Tgk. M. Nasir' },
      
      // SECRETARIAT
      { key: 'SEKDES', name: 'Sekretaris Desa', level: 2, sort: 1, category: 'SECRETARIAT', official: 'Mirza Maladi, A.Md' },
      
      // KAUR (Urusan) - Under Sekdes
      { key: 'KAUR_UMUM', name: 'Kaur Umum & Perencanaan', level: 3, sort: 1, category: 'SECRETARIAT', official: 'Abdul Muthalib' },
      { key: 'KAUR_KEUANGAN', name: 'Kaur Keuangan', level: 3, sort: 2, category: 'SECRETARIAT', official: 'Saifannur, S.Pd' },
      
      // KASI (Seksi) - Technical
      { key: 'KASI_PEMERINTAHAN', name: 'Kasi Pemerintahan', level: 3, sort: 3, category: 'TECHNICAL', official: 'Asrizal, S.Kom' },
      { key: 'KASI_KEISTIMEWAAN', name: 'Kasi Keistimewaan', level: 3, sort: 4, category: 'TECHNICAL', official: 'Tgk. M. Roum' },
      { key: 'KASI_PEMBANGUNAN', name: 'Kasi Pembangunan', level: 3, sort: 5, category: 'TECHNICAL', official: 'Azhari Ibrahim' },
      
      // DUSUN (Territorial)
      { key: 'KADUS_KULAM', name: 'Petua Dusun Kulam', level: 4, sort: 1, category: 'DUSUN', dusun: 'Dusun Kulam', official: 'Jafar Abu' },
      { key: 'KADUS_MUDA_INTAN', name: 'Petua Dusun Muda Intan', level: 4, sort: 2, category: 'DUSUN', dusun: 'Dusun Muda Intan', official: 'Zamzami, S.Pd' }, // Correction from Zamza
      { key: 'KADUS_BALE_SEUTUI', name: 'Petua Dusun Bale Seutui', level: 4, sort: 3, category: 'DUSUN', dusun: 'Dusun Bale Seutui', official: 'Agus Rinaldi' },
  ]

  console.log('🏛️  Seeding 2026 Organizational Structure...')

  for (const pos of positions) {
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
              phone: '0812xxxxxxxx', // Placeholder, user can update later
              address: 'Mata Mamplam',
              isActive: true
          }
      })
  }
  console.log('✅ Created organizational structure (13 Officials)')

  // ============================================
  // DISASTER MANAGEMENT (DUMMY DATA)
  // ============================================
  // Check if any active event exists
  const existingEvent = await prisma.disasterEvent.findFirst({ where: { status: 'ACTIVE' } })
  if (!existingEvent) {
      await prisma.disasterEvent.create({
          data: {
              title: 'Banjir Luapan 2026',
              description: 'Banjir akibat curah hujan tinggi yang menyebabkan luapan sungai.',
              status: 'ACTIVE',
              location: 'Seluruh Wilayah Desa',
              startDate: new Date(),
              posts: {
                  create: [
                      {
                          name: 'Posko Utama Meunasah',
                          location: 'Halaman Meunasah Desa',
                          capacity: 200,
                          picName: 'Bpk. Keuchik',
                          picPhone: '0811xxxxxx',
                          isActive: true,
                          logistics: {
                              create: [
                                  { itemName: 'Beras', unit: 'Sack', currentStock: 50, type: 'FOOD' },
                                  { itemName: 'Mie Instan', unit: 'Box', currentStock: 100, type: 'FOOD' },
                                  { itemName: 'Air Mineral', unit: 'Box', currentStock: 80, type: 'FOOD' }
                              ]
                          }
                      }
                  ]
              },
              damage: {
                  create: [
                      {
                          title: 'Jembatan Gantung Rusak Ringan',
                          description: 'Pondasi jembatan sedikit tergerus air.',
                          type: 'INFRASTRUCTURE',
                          severity: 'LIGHT',
                          location: 'Dusun Baroh',
                          status: 'REPORTED'
                      }
                  ]
              }
          }
      })
      console.log('✅ Created dummy disaster event (New Feature)')
  }

  // ============================================
  // SITE SETTINGS (ALREADY HANDLED ABOVE)
  // ============================================
  console.log('✅ Site Settings processing complete.')

  console.log('\n🎉 Restoration & Upgrade completed!')
}

main()
  .catch((e) => {
    console.error('❌ Restoration error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
