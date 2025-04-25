const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

exports.createBook = (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const hasRating = Array.isArray(bookObject.ratings) && bookObject.ratings.length > 0;

    const book = new Book({
      ...bookObject,
      imageUrl: imageUrl,
      userId: req.auth.userId,
      ratings: hasRating ? bookObject.ratings : [{
        userId: req.auth.userId,
        grade: 0
      }],
      averageRating: hasRating ? bookObject.averageRating : 0
    });

    book.save()
      .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
      .catch(error => res.status(400).json({ error }));
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de l\'enregistrement du livre' });
  }
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
  };

exports.getOneBook = (req, res, next) => {
    Book.findById(req.params.id)
      .then(book => {
        if (!book) return res.status(404).json({ message: "Livre non trouvé" });
        res.status(200).json(book);
      })
      .catch(error => res.status(400).json({ error }));
  };

exports.getBestRatedBooks = (req, res, next) => {
    Book.find()
      .sort({ averageRating: -1 })
      .limit(3)
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({ error }));
  };

exports.rateBook = (req, res, next) => {
    const { userId, rating } = req.body;
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Note invalide (entre 0 et 5)" });
    }
  
    Book.findById(req.params.id)
      .then(book => {
        if (!book) return res.status(404).json({ message: "Livre introuvable" });
  
        const alreadyRated = book.ratings.find(r => r.userId === userId);
        if (alreadyRated) return res.status(403).json({ message: "Livre déjà noté par cet utilisateur" });
  
        book.ratings.push({ userId, grade: rating });
  
        
        const sum = book.ratings.reduce((acc, r) => acc + r.grade, 0);
        book.averageRating = sum / book.ratings.length;
  
        return book.save()
          .then(updatedBook => res.status(200).json(updatedBook))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(400).json({ error }));
  };

exports.updateBook = (req, res, next) => {
    Book.findById(req.params.id)
      .then(book => {
        if (!book) return res.status(404).json({ message: "Livre introuvable" });
  
        
        if (book.userId !== req.auth.userId) {
          return res.status(403).json({ message: "Requête non autorisée" });
        }
  
        
        let bookData = {};
        let newImageUrl = book.imageUrl;
  
        if (req.file) {
          bookData = JSON.parse(req.body.book);
          newImageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  
          
          const oldFilename = book.imageUrl.split('/images/')[1];
          fs.unlink(path.join(__dirname, '../images', oldFilename), err => {
            if (err) console.error('Erreur lors de la suppression de l’ancienne image :', err);
          });
        } else {
          bookData = req.body;
        }
  
        
        Book.findByIdAndUpdate(req.params.id, {
          ...bookData,
          imageUrl: newImageUrl
        }, { new: true })
          .then(() => res.status(200).json({ message: "Livre mis à jour avec succès" }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.deleteBook = (req, res, next) => {
    Book.findById(req.params.id)
      .then(book => {
        if (!book) return res.status(404).json({ message: "Livre introuvable" });
  
        
        if (book.userId !== req.auth.userId) {
          return res.status(403).json({ message: "Requête non autorisée" });
        }
  
        
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(path.join(__dirname, '../images', filename), err => {
          if (err) console.error('Erreur lors de la suppression de l’image :', err);
        });
  
        
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Livre supprimé avec succès" }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };