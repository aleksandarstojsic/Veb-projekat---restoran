const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API greska.' }));
    throw new Error(error.message);
  }

  return response.json();
};

export const sedmicaApi = {
  getProducts: () => request('/products'),
  getCategories: () => request('/categories'),
  login: (payload) => request('/auth/login', {
    body: JSON.stringify(payload),
    method: 'POST',
  }),
  register: (payload) => request('/auth/register', {
    body: JSON.stringify(payload),
    method: 'POST',
  }),
  createOrder: (payload, userEmail) => request('/orders', {
    body: JSON.stringify(payload),
    headers: { 'x-user-email': userEmail },
    method: 'POST',
  }),
  getOrders: (userEmail) => request('/orders', {
    headers: { 'x-user-email': userEmail },
  }),
};
