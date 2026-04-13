const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const collections = await prisma.collection.findMany({ include: { card: { include: { set: true } } } });
    res.status(200).json(collections);
  } catch (error) { res.status(500).json({ error: 'Failed to retrieve collections' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const collection = await prisma.collection.findUnique({ where: { id: parseInt(req.params.id) }, include: { card: { include: { set: true } } } });
    if (!collection) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(collection);
  } catch (error) { res.status(500).json({ error: 'Failed to retrieve collection entry' }); }
});

router.post('/', async (req, res) => {
  try {
    const { userId, cardId, quantity, condition } = req.body;
    const collection = await prisma.collection.create({ data: { userId, cardId: parseInt(cardId), quantity: parseInt(quantity), condition } });
    res.status(201).json(collection);
  } catch (error) { res.status(500).json({ error: 'Failed to add card to collection' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { quantity, condition } = req.body;
    const collection = await prisma.collection.update({ where: { id: parseInt(req.params.id) }, data: { quantity: parseInt(quantity), condition } });
    res.status(200).json(collection);
  } catch (error) { res.status(500).json({ error: 'Failed to update collection entry' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.collection.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: 'Card removed from collection successfully' });
  } catch (error) { res.status(500).json({ error: 'Failed to remove card from collection' }); }
});

router.get('/sets/:setId/missing', async (req, res) => {
  try {
    const setId = parseInt(req.params.setId);
    const userId = req.query.userId;
    const allCards = await prisma.card.findMany({ where: { setId } });
    const collectedCards = await prisma.collection.findMany({ where: { userId, card: { setId } }, include: { card: true } });
    const collectedCardIds = collectedCards.map(c => c.cardId);
    const missingCards = allCards.filter(card => !collectedCardIds.includes(card.id));
    const ownedCards = allCards.filter(card => collectedCardIds.includes(card.id));
    res.status(200).json({ setId, totalCards: allCards.length, missingCount: missingCards.length, ownedCount: ownedCards.length, cards: [...missingCards.map(c => ({ ...c, collected: false })), ...ownedCards.map(c => ({ ...c, collected: true }))] });
  } catch (error) { res.status(500).json({ error: 'Failed to retrieve missing cards' }); }
});

module.exports = router;