import '../utils/shims';
import express from 'express';
const router = express.Router();
import passport from 'passport';
import { Book } from '../models';
const index = async (_, rs) => {
  console.log('inside of /api/books');
  try {
    const allBooks = await Book.find();
    rs.json({ books: allBooks });
  } catch (error) {
    console.error('[/api/books]', error);
    return rs.status(400).json({ message: 'error' });
  }
};

const show = async (rq, rs) => {
  const { id } = rq.params;
  try {
    const book = await Book.findById(id);
    rs.json({ book });
  } catch (error) {
    console.error('error inside of /api/books/:id', error);
    return rs.status(400).json({ message: 'Book not found' });
  }
};

const create = async (rq, rs) => {
  const { title, author, price, pages, isbn, genre } = rq.body;
  try {
    const newBook = await Book.create({ title, author, price, pages, isbn, genre });
    rs.json({ book: newBook });
  } catch (error) {
    console.error('eror inside of POST to /api/books', error);
    return rs.status(400).json({ message: 'book was not created' });
  }
};
const update = async (rq, rs) => {
  await Book.updateOne({ title: rq.body.title }, rq.body);
  const book = await Book.findOne({ title: rq.body.title });
  console.log(book);
  rs.redirect(`/api/books/${book.id}`);
};
const deleteBook = async (rq, rs) => {
  const { id } = rq.params;
  try {
    const book = await Book.findByIdAndDelete(id);
    // rs.json({ book });
    return rs.redirect('/api/books');
  } catch (error) {
    console.error('error inside of /api/books/:id', error);
    return rs.status(400).json({ message: 'Book not found' });
  }
};

// CREATE
router.post('/', passport.authenticate('jwt', { session: false }), create);
// READ
router.get('/', passport.authenticate('jwt', { session: false }), index);
router.get('/:id', passport.authenticate('jwt', { session: false }), show);
// UPDATE
router.put('/', passport.authenticate('jwt', { session: false }), update);
// DELETE
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteBook);
export default router;
