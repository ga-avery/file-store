import mongoose from 'mongoose';
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  pages: Number,
  genre: String,
  price: Number,
  isbn: String,
});

export const Book = mongoose.model('Book', bookSchema);
