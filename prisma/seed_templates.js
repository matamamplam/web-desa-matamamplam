const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('📜 Starting Letter Templates Restore (with Formatting Cleanup)...')

  // 1. Read Backup File
  const backupPath = path.join(__dirname, '..', 'backup_full.json')
  if (!fs.existsSync(backupPath)) {
    throw new Error('Backup file not found at: ' + backupPath)
  }
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  console.log('✅ Loaded backup_full.json')

  const templates = backup.letterTemplate || []
  if (templates.length === 0) {
      console.log('⚠️ No letter templates found in backup.')
      return
  }

  console.log(`📥 Restoring ${templates.length} Letter Templates...`)

  for (const item of templates) {
      try {
        // Logic Update: Prioritize 'code' for uniqueness check to avoid "Unique constraint failed"
        // If we upsert by ID, but the Code already exists on ANOTHER ID, it fails.
        // So we upsert by Code.
        // 1. Prepare clean data first
        const cleanItem = { ...item }
        
        // Strip relations (arrays) to prevent issues
        Object.keys(cleanItem).forEach(key => {
            if (Array.isArray(cleanItem[key]) || (typeof cleanItem[key] === 'object' && cleanItem[key] !== null && !(cleanItem[key] instanceof Date))) {
                delete cleanItem[key]
            }
        })

        // 2. Configure Where Clause & ID Handling
        const where = {}
        if (item.code) {
            where.code = item.code
            // Remove ID from data to avoid trying to change the ID of an existing record
            delete cleanItem.id 
        } else if (item.id) {
            where.id = item.id
        } else {
            console.warn(`Skipping template without ID or Code: ${item.name}`)
            continue
        }

        // ============================================================
        // FORMATTING CLEANUP: Remove BOLD tags from placeholders
        // ============================================================
        if (cleanItem.template) {
            let temp = cleanItem.template
            
            // 1. Remove <b>{{variable}}</b> -> {{variable}}
            temp = temp.replace(/<b>\s*({{.*?}})\s*<\/b>/gi, '$1')
            
            // 2. Remove <strong>{{variable}}</strong> -> {{variable}}
            temp = temp.replace(/<strong>\s*({{.*?}})\s*<\/strong>/gi, '$1')
            
            // 3. Remove inline style bold spans
            temp = temp.replace(/<span[^>]*style="[^"]*font-weight:\s*bold[^"]*"[^>]*>\s*({{.*?}})\s*<\/span>/gi, '$1')
            
            if (temp !== cleanItem.template) {
                // console.log(`   - Unbolded placeholders for: ${cleanItem.name}`)
                cleanItem.template = temp
            }
        }
        // ============================================================

        await prisma.letterTemplate.upsert({
            where: where,
            update: cleanItem, 
            create: cleanItem
        })
        process.stdout.write('.') // Progress indicator
      } catch (e) {
        console.warn(`\n⚠️ Failed to restore template ${item.name}: ${e.message}`)
      }
  }

  console.log('\n✅ Successfully restored & cleaned Letter Templates!')
}

main()
  .catch((e) => {
    console.error('\n❌ Error restoring templates:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
