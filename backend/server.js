const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connexion à MongoDB réussie');
    app.listen(process.env.PORT, () => {
      console.log(`Serveur lancé sur le port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('Erreur MongoDB :', err));