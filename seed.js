import { Book } from './models';

const books = [
  {
    title: 'Book 1',
    author: 'Author 1',
    pages: 199,
    genre: 'Business',
    price: 20,
    isbn: '902391340123941203192'
  },
  {
    title: 'Book 2',
    author: 'Author 2',
    pages: 300,
    genre: 'Software',
    price: 100,
    isbn: '9023913455523941203192'
  },
  {
    title: 'Book 3',
    author: 'Author 3',
    pages: 199,
    genre: 'Business',
    price: 20,
    isbn: '9023913403343441203192'
  },
  {
    title: 'Book 4',
    author: 'Author 4',
    pages: 333,
    genre: 'Software',
    price: 20,
    isbn: '9023912123941203192'
  }
];
try {
  const result = await Book.create(books);
  console.log(result);
} catch (error) {
  console.error(error);
}