const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all sets
router.get('/', async (req, res) => {
  try {
    const sets = await prisma.set.findMany();
    res.status(200).json(sets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve sets' });
  }
});

// GET single set by id
router.get('/:id', async (req, res) => {
  try {
    const set = await prisma.set.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!set) return res.status(404).json({ error: 'Set not found' });
    res.status(200).json(set);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve set' });
  }
});

// POST create a new set
router.post('/', async (req, res) => {
  try {
    const { name, series, totalCards, releaseDate } = req.body;
    const set = await prisma.set.create({
      data: { name, series, totalCards, releaseDate: new Date(releaseDate) }
    });
    res.status(201).json(set);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create set' });
  }
});

// PUT update a set
router.put('/:id', async (req, res) => {
  try {
    const { name, series, totalCards, releaseDate } = req.body;
    const set = await prisma.set.update({
      where: { id: parseInt(req.params.id) },
      data: { name, series, totalCards, releaseDate: new Date(releaseDate) }
    });
    res.status(200).json(set);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update set' });
  }
});

// DELETE a set
router.delete('/:id', async (req, res) => {
  try {
    await prisma.set.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(200).json({ message: 'Set deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete set' });
  }
});

module.exports = router;