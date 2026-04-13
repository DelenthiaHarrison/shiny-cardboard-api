const express = require('express');
const app = express();

app.use(express.json());

const setsRouter = require('./routes/sets');
const cardsRouter = require('./routes/cards');
const collectionsRouter = require('./routes/collections');

app.use('/sets', setsRouter);
app.use('/cards', cardsRouter);
app.use('/collections', collectionsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Shiny Cardboard API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
