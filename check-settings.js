const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function checkSettings() {
  let output = '';
  try {
    const settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      output += '❌ No settings found in database\n';
      fs.writeFileSync('settings-check-result.txt', output);
      return;
    }
    
    output += '✅ Settings found!\n\n';
    output += '📊 Settings JSON:\n';
    output += JSON.stringify(settings.settings, null, 2) + '\n\n';
    
    // @ts-ignore
    const heroBackground = settings.settings?.general?.heroBackground;
    output += `🖼️ Hero Background Value: ${heroBackground || '❌ NULL/UNDEFINED'}\n`;
    
    fs.writeFileSync('settings-check-result.txt', output);
    console.log(output);
    console.log('\n✅ Output also saved to settings-check-result.txt');
    
  } catch (error) {
    output += `Error: ${error}\n`;
    fs.writeFileSync('settings-check-result.txt', output);
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSettings();
