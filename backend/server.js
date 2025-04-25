const mongoose = require('mongoose');
const app = require('./app');
const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
  console.log('Chargement des variables depuis .env.local');
} else {
  dotenv.config();
  console.log('Chargement des variables depuis .env');
};

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connexion à MongoDB réussie');
    app.listen(process.env.PORT, () => {
      console.log(`Serveur lancé sur le port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('Erreur MongoDB :', err));