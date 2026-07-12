const express = require('express');
const { createId, state } = require('../store/memoryStore');

const router = express.Router();

router.post('/register', (request, response) => {
  const { email, name, password } = request.body;

  if (!name || !email || !password || password.length < 6) {
    return response.status(400).json({ message: 'Ime, email i lozinka od 6 karaktera su obavezni.' });
  }

  const existingUser = state.users.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return response.status(409).json({ message: 'Korisnik vec postoji.' });
  }

  const user = {
    id: createId('usr', state.users),
    name,
    email,
    password,
    role: 'registrovani korisnik',
  };

  state.users.push(user);
  return response.status(201).json({ user: { ...user, password: undefined } });
});

router.post('/login', (request, response) => {
  const { email, password } = request.body;
  const user = state.users.find((account) => (
    account.email.toLowerCase() === String(email).toLowerCase() && account.password === password
  ));

  if (!user) {
    return response.status(401).json({ message: 'Neispravan email ili lozinka.' });
  }

  return response.json({ user: { ...user, password: undefined } });
});

module.exports = router;
