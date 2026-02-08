
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const events = await prisma.disasterEvent.findMany()
  console.log("All Events:", JSON.stringify(events, null, 2))
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
