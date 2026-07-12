const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { createId, state } = require('../store/memoryStore');

const router = express.Router();

router.get('/', (request, response) => response.json(state.categories));

router.post('/', requireAdmin, (request, response) => {
  const { name } = request.body;

  if (!name) {
    return response.status(400).json({ message: 'Naziv kategorije je obavezan.' });
  }

  const category = { id: createId('cat', state.categories), name };
  state.categories.push(category);
  return response.status(201).json(category);
});

router.put('/:id', requireAdmin, (request, response) => {
  const category = state.categories.find((item) => item.id === request.params.id);

  if (!category) {
    return response.status(404).json({ message: 'Kategorija nije pronadjena.' });
  }

  category.name = request.body.name || category.name;
  return response.json(category);
});

router.delete('/:id', requireAdmin, (request, response) => {
  const index = state.categories.findIndex((item) => item.id === request.params.id);

  if (index === -1) {
    return response.status(404).json({ message: 'Kategorija nije pronadjena.' });
  }

  const [deletedCategory] = state.categories.splice(index, 1);
  return response.json(deletedCategory);
});

module.exports = router;
