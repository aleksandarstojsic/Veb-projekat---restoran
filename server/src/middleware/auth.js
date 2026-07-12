const { state } = require('../store/memoryStore');

const getCurrentUser = (request) => {
  const email = request.header('x-user-email');

  if (!email) {
    return null;
  }

  return state.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
};

const requireAuth = (request, response, next) => {
  const user = getCurrentUser(request);

  if (!user) {
    return response.status(401).json({ message: 'Potrebna je prijava.' });
  }

  request.user = user;
  return next();
};

const requireAdmin = (request, response, next) => {
  const user = getCurrentUser(request);

  if (!user || user.role !== 'administrator') {
    return response.status(403).json({ message: 'Admin pristup je obavezan.' });
  }

  request.user = user;
  return next();
};

module.exports = {
  requireAdmin,
  requireAuth,
};
