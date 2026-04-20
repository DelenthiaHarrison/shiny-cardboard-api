const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.collectionCard.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.card.deleteMany();
  await prisma.set.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data...');

  const adminPassword = await bcrypt.hash('password123', 12);
  const userPassword = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.create({
    data: { username: 'admin1', email: 'admin@shiny.com', password: adminPassword, role: 'admin' }
  });

  const user = await prisma.user.create({
    data: { username: 'user1', email: 'user@shiny.com', password: userPassword, role: 'user' }
  });

  console.log('Users created:', admin.username, user.username);

  const set1 = await prisma.set.create({
    data: { name: 'Scarlet Violet', setCode: 'SVI', series: 'Scarlet Violet', totalCards: 198, releaseDate: new Date('2023-03-31') }
  });

  const set2 = await prisma.set.create({
    data: { name: 'Paldea Evolved', setCode: 'PAL', series: 'Scarlet Violet', totalCards: 279, releaseDate: new Date('2023-06-09') }
  });

  console.log('Sets created:', set1.name, set2.name);

  const card1 = await prisma.card.create({ data: { name: 'Pikachu', cardNumber: '025/198', rarity: 'Common', type: 'Lightning', artist: 'Atsuko Nishida', setId: set1.id } });
  const card2 = await prisma.card.create({ data: { name: 'Charizard ex', cardNumber: '006/198', rarity: 'Double Rare', type: 'Fire', artist: 'Mitsuhiro Arita', setId: set1.id } });
  const card3 = await prisma.card.create({ data: { name: 'Gardevoir ex', cardNumber: '086/193', rarity: 'Double Rare', type: 'Psychic', artist: 'Narumi Sato', setId: set2.id } });
  const card4 = await prisma.card.create({ data: { name: 'Miraidon ex', cardNumber: '081/198', rarity: 'Double Rare', type: 'Lightning', artist: 'Noriko Hotta', setId: set1.id } });
  const card5 = await prisma.card.create({ data: { name: 'Arcanine ex', cardNumber: '022/193', rarity: 'Double Rare', type: 'Fire', artist: 'Kouki Saitou', setId: set2.id } });

  console.log('Cards created:', card1.name, card2.name, card3.name, card4.name, card5.name);

  const collection1 = await prisma.collection.create({
    data: { name: 'Main Binder', userId: user.id }
  });

  const collection2 = await prisma.collection.create({
    data: { name: 'Trade Binder', userId: user.id }
  });

  await prisma.collectionCard.create({ data: { collectionId: collection1.id, cardId: card1.id, quantity: 2, condition: 'NearMint' } });
  await prisma.collectionCard.create({ data: { collectionId: collection1.id, cardId: card2.id, quantity: 1, condition: 'LightlyPlayed' } });
  await prisma.collectionCard.create({ data: { collectionId: collection2.id, cardId: card3.id, quantity: 1, condition: 'NearMint' } });

  console.log('Collections created:', collection1.name, collection2.name);
  console.log('Seeding complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });