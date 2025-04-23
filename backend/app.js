const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;