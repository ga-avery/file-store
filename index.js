import './utils/shims';
import express, { urlencoded } from 'express';
import cors from 'cors';
import passport from 'passport';

import myPassport from './config/passport';
// Controllers
import users from './api/users';
import books from './api/books';

const PORT = process.env.PORT || 80;
const app = express();

app.set('json spaces', 2);

// Middleware
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());
myPassport(passport);

app.get('/', (_, rs) => {
  rs.status(200).json({ message: 'Smile, you are being watched by the Backend Engineering Team' });
});

app.get('/ping', (_, rs) => {
  rs.status(200).json({ message: 'pong!' });
});

app.use('/api/users', users);
app.use('/api/books', books);
// 404 route
app.get('/*', (_, rs) => {
  rs.status(404).json({ message: 'Data not found' });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
