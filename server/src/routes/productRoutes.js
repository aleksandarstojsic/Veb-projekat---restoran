const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { createId, state } = require('../store/memoryStore');

const router = express.Router();

router.get('/', (request, response) => {
  const { category, q } = request.query;
  const search = String(q || '').trim().toLowerCase();

  const products = state.products.filter((product) => {
    const matchesCategory = !category || category === 'Sve' || product.category === category;
    const matchesSearch = !search
      || product.name.toLowerCase().includes(search)
      || product.description.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  return response.json(products);
});

router.post('/', requireAdmin, (request, response) => {
  const { category, description, image, name, price } = request.body;

  if (!name || !category || !price) {
    return response.status(400).json({ message: 'Naziv, kategorija i cena su obavezni.' });
  }

  const product = {
    id: createId('prd', state.products),
    name,
    category,
    price: Number(price),
    description: description || '',
    image: image || '',
    available: true,
  };

  state.products.push(product);
  return response.status(201).json(product);
});

router.put('/:id', requireAdmin, (request, response) => {
  const product = state.products.find((item) => item.id === request.params.id);

  if (!product) {
    return response.status(404).json({ message: 'Proizvod nije pronadjen.' });
  }

  Object.assign(product, request.body);
  return response.json(product);
});

router.delete('/:id', requireAdmin, (request, response) => {
  const index = state.products.findIndex((item) => item.id === request.params.id);

  if (index === -1) {
    return response.status(404).json({ message: 'Proizvod nije pronadjen.' });
  }

  const [deletedProduct] = state.products.splice(index, 1);
  return response.json(deletedProduct);
});

module.exports = router;
