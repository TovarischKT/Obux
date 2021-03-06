const mongoose = require('mongoose');

const booksSchema = mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  autor: String,
  ano: String,
  genero: String,
  qualidade: { 
    type: String,
    required: true
  },
  foto: {
    type: String,
  },
  disponibilidade: {
    type: String,
    required: true
  },
  sinopse: String,
});

module.exports = mongoose.model('Books', booksSchema);
