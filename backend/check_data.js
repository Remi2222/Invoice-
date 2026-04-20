require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function checkData() {
  try {
    console.log('=== VÉRIFICATION DES DONNÉES DANS LA BASE NEON ===\n');

    // Vérifier chaque table
    const tables = [
      { name: 'user', display: 'Utilisateurs' },
      { name: 'client', display: 'Clients' },
      { name: 'invoice', display: 'Factures' },
      { name: 'invoiceItem', display: 'Articles de facture' }
    ];

    for (const table of tables) {
      try {
        const count = await prisma[table.name].count();
        console.log(`${table.display}: ${count} enregistrement(s)`);

        // Si des données existent, afficher les premiers enregistrements
        if (count > 0) {
          const records = await prisma[table.name].findMany({ take: 3 });
          console.log('Premiers enregistrements:');
          records.forEach((record, index) => {
            console.log(`  ${index + 1}. ${JSON.stringify(record, null, 2)}`);
          });
        }
        console.log('');
      } catch (error) {
        console.log(`${table.display}: ERREUR - ${error.message}\n`);
      }
    }

    // Vérifier les relations
    console.log('=== VÉRIFICATION DES RELATIONS ===\n');

    try {
      const usersWithRelations = await prisma.user.findMany({
        include: {
          clients: true,
          invoices: true
        }
      });

      console.log(`Utilisateurs avec relations: ${usersWithRelations.length}`);
      if (usersWithRelations.length > 0) {
        usersWithRelations.forEach(user => {
          console.log(`- ${user.email}: ${user.clients.length} client(s), ${user.invoices.length} facture(s)`);
        });
      }
      console.log('');

    } catch (error) {
      console.log(`Erreur lors de la vérification des relations: ${error.message}\n`);
    }

  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();