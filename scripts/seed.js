const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.collection.deleteMany();
  await prisma.card.deleteMany();
  await prisma.set.deleteMany();

  console.log('Cleared existing data...');

  // Create Sets
  const set1 = await prisma.set.create({
    data: { name: 'Scarlet Violet', series: 'Scarlet Violet', totalCards: 198, releaseDate: new Date('2023-03-31') }
  });

  const set2 = await prisma.set.create({
    data: { name: 'Paldea Evolved', series: 'Scarlet Violet', totalCards: 279, releaseDate: new Date('2023-06-09') }
  });

  console.log('Sets created:', set1.name, set2.name);

  // Create Cards
  const card1 = await prisma.card.create({ data: { name: 'Pikachu', cardNumber: '025/198', rarity: 'Common', type: 'Lightning', artist: 'Atsuko Nishida', setId: set1.id } });
  const card2 = await prisma.card.create({ data: { name: 'Charizard ex', cardNumber: '006/198', rarity: 'Double Rare', type: 'Fire', artist: 'Mitsuhiro Arita', setId: set1.id } });
  const card3 = await prisma.card.create({ data: { name: 'Gardevoir ex', cardNumber: '086/193', rarity: 'Double Rare', type: 'Psychic', artist: 'Narumi Sato', setId: set2.id } });
  const card4 = await prisma.card.create({ data: { name: 'Miraidon ex', cardNumber: '081/198', rarity: 'Double Rare', type: 'Lightning', artist: 'Noriko Hotta', setId: set1.id } });
  const card5 = await prisma.card.create({ data: { name: 'Arcanine ex', cardNumber: '022/193', rarity: 'Double Rare', type: 'Fire', artist: 'Kouki Saitou', setId: set2.id } });

  console.log('Cards created:', card1.name, card2.name, card3.name, card4.name, card5.name);

  // Create Collections
  await prisma.collection.create({ data: { userId: 'user1', cardId: card1.id, quantity: 2, condition: 'NM' } });
  await prisma.collection.create({ data: { userId: 'user1', cardId: card2.id, quantity: 1, condition: 'LP' } });
  await prisma.collection.create({ data: { userId: 'user2', cardId: card3.id, quantity: 3, condition: 'NM' } });
  await prisma.collection.create({ data: { userId: 'user2', cardId: card4.id, quantity: 1, condition: 'MP' } });

  console.log('Collections created!');
  console.log('Seeding complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });