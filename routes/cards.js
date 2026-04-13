const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all cards
router.get('/', async (req, res) => {
  try {
    const cards = await prisma.card.findMany({
      include: { set: true }
    });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve cards' });
  }
});

// GET single card by id
router.get('/:id', async (req, res) => {
  try {
    const card = await prisma.card.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { set: true }
    });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve card' });
  }
});

// POST create a new card
router.post('/', async (req, res) => {
  try {
    const { name, cardNumber, rarity, type, artist, imageUrl, setId } = req.body;
    const card = await prisma.card.create({
      data: { name, cardNumber, rarity, type, artist, imageUrl, setId: parseInt(setId) }
    });
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// PUT update a card
router.put('/:id', async (req, res) => {
  try {
    const { name, cardNumber, rarity, type, artist, imageUrl, setId } = req.body;
    const card = await prisma.card.update({
      where: { id: parseInt(req.params.id) },
      data: { name, cardNumber, rarity, type, artist, imageUrl, setId: parseInt(setId) }
    });
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// DELETE a card
router.delete('/:id', async (req, res) => {
  try {
    await prisma.card.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(200).json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete card' });
  }
});
module.exports = router;
