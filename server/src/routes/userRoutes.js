const express = require('express');
const { requireAdmin } = require('../middleware/auth');
const { state } = require('../store/memoryStore');

const router = express.Router();

router.get('/', requireAdmin, (request, response) => {
  const users = state.users.map(({ password, ...user }) => user);
  return response.json(users);
});

router.patch('/:id/role', requireAdmin, (request, response) => {
  const user = state.users.find((account) => account.id === request.params.id);

  if (!user) {
    return response.status(404).json({ message: 'Korisnik nije pronadjen.' });
  }

  user.role = request.body.role || user.role;
  return response.json({ ...user, password: undefined });
});

module.exports = router;
