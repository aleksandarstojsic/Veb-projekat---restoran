require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (request, response) => {
  response.json({
    app: 'Sedmica API',
    status: 'ok',
    storage: process.env.MONGO_URI ? 'mongodb-ready' : 'memory',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

const startServer = async () => {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB konekcija je uspesna.');
    } catch (error) {
      console.warn('MongoDB nije dostupan, API nastavlja sa memorijskim podacima.');
    }
  }

  app.listen(port, () => {
    console.log(`Sedmica API radi na portu ${port}.`);
  });
};

startServer();
