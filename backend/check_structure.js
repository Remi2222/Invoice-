require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function checkTableStructure() {
  try {
    console.log('=== STRUCTURE DE LA TABLE INVOICE ===\n');

    // Vérifier la structure de la table Invoice
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'Invoice'
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;

    console.log('Colonnes de la table Invoice:');
    columns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(NULL)' : '(NOT NULL)'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    console.log('\n=== COMPARAISON AVEC LE SCHÉMA PRISMA ===\n');

    // Colonnes attendues selon le schéma Prisma
    const expectedColumns = [
      'id', 'number', 'userId', 'clientId', 'total', 'status',
      'dueDate', 'logo', 'invoiceDate', 'poNumber', 'paymentTerms', 'currency', 'createdAt'
    ];

    console.log('Colonnes attendues dans le schéma Prisma:');
    expectedColumns.forEach(col => console.log(`- ${col}`));

    console.log('\nColonnes manquantes:');
    const existingColumnNames = columns.map(col => col.column_name);
    const missingColumns = expectedColumns.filter(col => !existingColumnNames.includes(col));
    if (missingColumns.length === 0) {
      console.log('Aucune colonne manquante');
    } else {
      missingColumns.forEach(col => console.log(`- ${col}`));
    }

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTableStructure();