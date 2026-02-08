
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function main() {
  console.log("Starting full database backup...")
  
  const backup = {}
  
  // List of all models to backup
  const models = [
    'user',
    'kartuKeluarga', 
    'penduduk',
    'letterTemplate',
    'letterRequest',
    'newsCategory',
    'news',
    'newsComment',
    'project',
    'uMKMCategory',
    'uMKM',
    'product',
    'complaintCategory',
    'complaint',
    'galleryCategory',
    'galleryItem',
    'document',
    'villageProfile',
    'officialPosition', // Checking this later
    'event',
    'announcement',
    'siteSettings',
    'villageOfficialPosition',
    'villageOfficial',
    'phoneViewLog',
    'earthquake',
    'disasterEvent',
    'commandPost',
    'affectedResident',
    'damageAssessment',
    'logistics',
    'logisticsTransaction'
  ]

  console.log("Prisma Client Properties:", Object.keys(prisma).filter(k => !k.startsWith('_')))

  for (const model of models) {
    try {
      if (prisma[model]) {
        console.log(`Backing up ${model}...`)
        const data = await prisma[model].findMany()
        console.log(` - Found ${data.length} records`)
        backup[model] = data
      } else {
        console.warn(`[WARN] Model '${model}' not found in Prisma Client instance`)
        // Try to find case-insensitive match
        const actualKey = Object.keys(prisma).find(k => k.toLowerCase() === model.toLowerCase())
        if (actualKey) {
             console.log(` - Retry with key '${actualKey}'...`)
             const data = await prisma[actualKey].findMany()
             console.log(` - Found ${data.length} records`)
             backup[actualKey] = data
        }
      }
    } catch (e) {
      console.error(`[ERROR] Failed to backup ${model}:`, e.message)
    }
  }

  fs.writeFileSync('backup_full.json', JSON.stringify(backup, null, 2))
  console.log("Backup saved to backup_full.json")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
