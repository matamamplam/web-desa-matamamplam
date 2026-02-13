
import { PrismaClient, JenisRumah } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Verifying Schema Changes...')
  
  try {
    // 1. Check if we can access the new Bansos model
    const bansosCount = await prisma.bansos.count()
    console.log(`✅ Bansos table exists. Count: ${bansosCount}`)

    // 2. Check if we can use the new enum JenisRumah
    // We cannot easily check the column existence without querying, so let's try to query KKs
    const kks = await prisma.kartuKeluarga.findMany({
        take: 1,
        select: { id: true, jenisRumah: true }
    })
    console.log(`✅ KartuKeluarga table queried. Sample:`, kks[0] || 'No KK found')

    console.log('Schema verification success!')
  } catch (e) {
    console.error('❌ Schema verification failed:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
