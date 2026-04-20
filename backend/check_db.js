require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function checkTables() {
  try {
    // First, let's list all tables using raw SQL
    const result = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`;
    console.log('Tables in database:');
    result.forEach(row => {
      console.log(`- ${row.tablename}`);
    });
    console.log('');

    // Check what models are available in Prisma client
    console.log('Available Prisma models:');
    const modelNames = Object.keys(prisma).filter(key => !key.startsWith('$') && typeof prisma[key] === 'object' && prisma[key] !== null);
    console.log(modelNames);
    console.log('');

    // Now check each expected table
    const tables = ['user', 'client', 'invoice', 'invoiceItem'];

    for (const table of tables) {
      try {
        const count = await prisma[table].count();
        console.log(`Table ${table}: EXISTS (${count} records)`);
      } catch (error) {
        console.log(`Table ${table}: DOES NOT EXIST or ERROR - ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();