const express = require('express');
const { requireAdmin, requireAuth } = require('../middleware/auth');
const { state } = require('../store/memoryStore');

const router = express.Router();

router.get('/', requireAuth, (request, response) => {
  if (request.user.role === 'administrator') {
    return response.json(state.orders);
  }

  return response.json(state.orders.filter((order) => order.userEmail === request.user.email));
});

router.post('/', requireAuth, (request, response) => {
  const { deliveryMethod, items, note, paymentMethod } = request.body;

  if (!Array.isArray(items) || items.length === 0) {
    return response.status(400).json({ message: 'Porudzbina mora imati stavke.' });
  }

  const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const order = {
    id: `SED-${String(state.orders.length + 1).padStart(3, '0')}`,
    userEmail: request.user.email,
    items,
    total,
    deliveryMethod,
    paymentMethod,
    note: note || '',
    status: 'Primljena',
    createdAt: new Date().toISOString(),
  };

  state.orders.unshift(order);
  return response.status(201).json(order);
});

router.patch('/:id/status', requireAdmin, (request, response) => {
  const order = state.orders.find((item) => item.id === request.params.id);

  if (!order) {
    return response.status(404).json({ message: 'Porudzbina nije pronadjena.' });
  }

  order.status = request.body.status || order.status;
  return response.json(order);
});

module.exports = router;
