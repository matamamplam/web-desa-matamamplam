
import { PrismaClient, JenisRumah } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting Verification...')
  
  try {
    // 1. Find or Create a Penduduk & KK
    let penduduk = await prisma.penduduk.findFirst({
        include: { kk: true }
    })

    if (!penduduk) {
        console.log('⚠️ No Penduduk found. Skipping creation test.')
    } else {
        // 2. Test Updating House Type (Jenis Rumah)
        console.log(`🏠 Testing House Type for KK: ${penduduk.kk.noKK}`)
        const updatedKK = await prisma.kartuKeluarga.update({
            where: { id: penduduk.kkId },
            data: { jenisRumah: "KAYU" }
        })
        
        if (updatedKK.jenisRumah === "KAYU") {
            console.log('✅ House Type updated successfully to KAYU')
        } else {
            console.error('❌ Failed to update House Type')
        }
    }

    // Skipped: Bansos Creation Test (Requires Program ID)

  } catch (e) {
    console.error('❌ Verification failed:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
