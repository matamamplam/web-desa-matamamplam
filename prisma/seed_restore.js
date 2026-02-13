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

  // 2. Clear tables that will be replaced by new feature seeds (Optional but safer)
  // We want to use the NEW structure for these, not the old backup data
  console.log('🧹 Clearing old settings and structure data...')
  try {
    await prisma.siteSettings.deleteMany({})
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
            if (Array.isArray(cleanItem[key])) {
                delete cleanItem[key] // Remove nested relations
            }
            if (cleanItem[key] === null && key !== 'avatar' && key !== 'description') {
                // Optional: keep nulls for fields that allow it, but relationships like 'dusun' might be null
                // safely keeping null scalar fields is usually fine.
            }
        })

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
  // If the backup format is flat (just fields), safeRestore works.
  // If it includes relations, we might need to strip them.
  // For now, assuming backup is standard Prisma dump (flat-ish or includes ids).

  // Restore Letters
  await safeRestore('letterTemplate', backup.letterTemplate)
  // letterRequests depend on inhabitants and templates
  await safeRestore('letterRequest', backup.letterRequest) 

  // ============================================
  // 4. SEED NEW FEATURES (From Standard Seed)
  // ============================================
  console.log('🆕 Seeding New Features (Officials, Settings, Disaster)...')

  // ... [PASTE SEED.JS LOGIC HERE FOR NEW FEATURES] ...
  
    // ============================================
  // ORGANIZATIONAL STRUCTURE (VILLAGE OFFICIALS)
  // ============================================
  // Define positions hierarchy
  const positions = [
      { key: 'KEUCHIK', name: 'Keuchik Gampong', level: 1, sort: 1, category: 'LEADERSHIP' },
      { key: 'SEKDES', name: 'Sekretaris Gampong', level: 4, sort: 1, category: 'SECRETARIAT' },
      { key: 'KAUR_KEUANGAN', name: 'Kaur Keuangan', level: 4, sort: 2, category: 'SECRETARIAT' },
      { key: 'KAUR_UMUM', name: 'Kaur Umum & Perencanaan', level: 4, sort: 3, category: 'SECRETARIAT' },
      { key: 'KASI_PEMERINTAHAN', name: 'Kasi Pemerintahan', level: 5, sort: 1, category: 'TECHNICAL' },
      { key: 'KASI_KESEJAHTERAAN', name: 'Kasi Kesejahteraan', level: 5, sort: 2, category: 'TECHNICAL' },
      { key: 'KADUS_TUNONG', name: 'Kepala Dusun Tunong', level: 6, sort: 1, category: 'DUSUN', dusun: 'Dusun Tunong' },
      { key: 'KADUS_BAROH', name: 'Kepala Dusun Baroh', level: 6, sort: 2, category: 'DUSUN', dusun: 'Dusun Baroh' },
  ]

  for (const pos of positions) {
      const position = await prisma.villageOfficialPosition.upsert({
          where: { positionKey: pos.key },
          update: {},
          create: {
              category: pos.category,
              positionKey: pos.key,
              positionName: pos.name,
              level: pos.level,
              sortOrder: pos.sort,
              dusunName: pos.dusun
          }
      })

      // Assign dummy official
      await prisma.villageOfficial.upsert({
          where: { positionId: position.id },
          update: {},
          create: {
              positionId: position.id,
              name: `Pejabat ${pos.name}`, // Placeholder name
              phone: '0812xxxxxxxx',
              address: 'Mata Mamplam',
              isActive: true
          }
      })
  }
  console.log('✅ Created organizational structure (New Feature)')

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
  // SITE SETTINGS (DEFAULT)
  // ============================================
  // Check if settings already exist
  const existingSettings = await prisma.siteSettings.findFirst()
  if (!existingSettings) {
      await prisma.siteSettings.create({
        data: {
            settings: {
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
                // Updated structure elements for footer/navbar map prevention
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
                faq: [], // Can be populated if needed
                footer: {
                    description: 'Website Resmi Pemerintah Gampong Mata Mamplam',
                    socialMedia: {
                         facebook: 'https://facebook.com',
                         instagram: 'https://instagram.com'
                    },
                    copyright: '© 2026 Desa Mata Mamplam'
                }
            }
        }
      })
      console.log('✅ Created default site settings (New Feature Compatible)')
  }

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
