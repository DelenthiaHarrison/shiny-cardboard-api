const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate, authorizeAdmin } = require('../middleware/authenticate');

router.get('/', async (req, res) => {
  try {
    const sets = await prisma.set.findMany();
    res.status(200).json(sets);
  } catch (error) { res.status(500).json({ error: 'Failed to retrieve sets' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const set = await prisma.set.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!set) return res.status(404).json({ error: 'Set not found' });
    res.status(200).json(set);
  } catch (error) { res.status(500).json({ error: 'Failed to retrieve set' }); }
});

router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { name, setCode, series, totalCards, releaseDate } = req.body;
    const set = await prisma.set.create({ data: { name, setCode, series, totalCards, releaseDate: new Date(releaseDate) } });
    res.status(201).json(set);
  } catch (error) { res.status(500).json({ error: 'Failed to create set' }); }
});

router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { name, setCode, series, totalCards, releaseDate } = req.body;
    const set = await prisma.set.update({ where: { id: parseInt(req.params.id) }, data: { name, setCode, series, totalCards, releaseDate: new Date(releaseDate) } });
    res.status(200).json(set);
  } catch (error) { res.status(500).json({ error: 'Failed to update set' }); }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    await prisma.set.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: 'Set deleted successfully' });
  } catch (error) { res.status(500).json({ error: 'Failed to delete set' }); }
});

module.exports = router;