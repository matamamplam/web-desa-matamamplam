
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function main() {
  console.log("Starting full database backup...")
  
  const backup = {}
  
  // List of all models to backup
  const models = [
    'user',
    'passwordResetToken',
    'kartuKeluarga',
    'penduduk',
    'letterTemplate',
    'letterRequest',
    'newsCategory',
    'news',
    'newsComment',
    'project',
    'uMKMCategory',
    'uMKM', // Note: Prisma client typically camelCases this to uMKM or umkm depending on casing. I'll rely on the dynamic check if it fails, but standard is lowercased first letter. Actually let's check generated client normally.
    'product',
    'complaintCategory',
    'complaint',
    'galleryCategory',
    'galleryItem',
    'document',
    'villageProfile',
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

  console.log("Prisma Client Properties:", Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')))

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
        const actualKey = Object.keys(prisma).find(k => k.toLowerCase() === model.toLowerCase() && !k.startsWith('$') && !k.startsWith('_'))
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


  fs.writeFileSync('backup_full.json', JSON.stringify(backup, (key, value) => 
    typeof value === 'bigint'
      ? value.toString()
      : value 
  , 2))
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
