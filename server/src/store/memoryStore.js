const { categories, products, users } = require('../data/seedData');

const state = {
  categories: [...categories],
  products: [...products],
  users: [...users],
  orders: [],
};

const createId = (prefix, collection) => `${prefix}-${String(collection.length + 1).padStart(3, '0')}`;

module.exports = {
  state,
  createId,
};
