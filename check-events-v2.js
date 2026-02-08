
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log("Testing API Query...")
  try {
      const activeEvent = await prisma.disasterEvent.findFirst({
        where: {
          status: "ACTIVE"
        },
        include: {
          posts: {
            where: { isActive: true },
            include: {
              _count: {
                select: { refugees: true }
              },
              logistics: true
            }
          },
          damage: {
              orderBy: { reportedAt: 'desc' }
          },
          _count: {
            select: {
              affected: true,
              damage: true
            }
          }
        },
        orderBy: {
          startDate: "desc"
        }
      })
      console.log("Success:", JSON.stringify(activeEvent, null, 2))
  } catch (e) {
      console.error("Query Failed:", e)
  }
}

main()
  .catch(e => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
