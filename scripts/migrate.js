require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

try {
  console.log('Running Prisma DB Push...');
  execSync('npx prisma db push --accept-data-loss', {
    stdio: 'inherit',
    env: process.env,
  });
  console.log('✅ Database migration completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
