const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const products = [
  { id: 1, name: 'Milk' },
  { id: 2, name: 'Eggs' },
  { id: 3, name: 'Bread' },
  { id: 4, name: 'Rice' },
  { id: 5, name: 'Water' },
  { id: 6, name: 'Coke' },
  { id: 7, name: 'Cake' },
  { id: 8, name: 'Lemon' },
  { id: 9, name: 'Apple' },
  { id: 10, name: 'Chocolate' },
  { id: 11, name: 'Pasta' },
  { id: 12, name: 'Chicken' },
  // ... Другие продукты ...
];

const shoppingLists = [
  {
    id: 1,
    name: 'Groceries',
    items: [
      { id: 1, productId: 1, quantity: 2 },
      { id: 2, productId: 2, quantity: 1 },
      { id: 3, productId: 3, quantity: 3 },
    ],
  },
  {
    id: 2,
    name: 'Electronics',
    items: [
      { id: 4, productId: 4, quantity: 1 },
      { id: 5, productId: 5, quantity: 2 },
    ],
  },
];

app.use(express.json());

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/shopping-lists', (req, res) => {
  res.json(shoppingLists);
});

app.post('/shopping-lists/:id/items', (req, res) => {
  const listId = parseInt(req.params.id);
  const { name, quantity } = req.body;

  const listIndex = shoppingLists.findIndex(list => list.id === listId);
  if (listIndex !== -1) {
    const newItem = { id: shoppingLists[listIndex].items.length + 1, name, quantity };
    shoppingLists[listIndex].items.push(newItem);
    res.status(201).json(shoppingLists[listIndex]);
  } else {
    res.status(404).json({ error: 'List not found' });
  }
});

app.post('/shopping-lists', (req, res) => {
  const newList = req.body;
  newList.id = shoppingLists.length + 1;
  shoppingLists.push(newList);
  res.status(201).json(newList);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
