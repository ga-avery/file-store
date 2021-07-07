// import './utils/shims';
import { title } from './utils';
import express, { urlencoded } from 'express';
import cors from 'cors';
import passport from 'passport';
import fileUpload from 'express-fileupload';
import myPassport from './config/passport';
// Controllers
import users from './api/users';
import books from './api/books';

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const FRONTEND = process.env.FRONTEND ?? 'http://localhost';
const PORT = process.env.PORT ?? 80;
const app = express();

app.set('json spaces', 2);

// Middleware
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

app.use(passport.initialize());
myPassport(passport);

app.get('/', (_, rs) => {
  rs.status(200).json({ message: title() });
});

app.get('/ping', (_, rs) => {
  rs.status(200).json({ message: 'pong!' });
});

app.use('/api/users', users);
app.use('/api/books', books);
app.get('/favicon.ico', (_, rs) => {
  rs.status(404).send('file not found');
});

import crypto from 'crypto';
import { DBFile, User } from './models';
const getSha256 = data => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

app.get('/profile/files', passport.authenticate('jwt', { session: false }), async (rq, rs) => {
  const id = rq.user.id;
  const user = await User.findOne({ _id: id });
  const files = user.files.map(numToLetter).map(file => `${FRONTEND}/${file}`);
  rs.json(files);
});
app.post('/', async (rq, rs) => {
  const id = rq.headers['x-user-id'];
  const file = rq.files.file;
  const { name, mimetype } = file;
  const hash = getSha256(file.data);
  let dbFile = await DBFile.findOne({ hash });
  let ext = `${rq.files.file.name.split('.').pop()}`;
  if (!dbFile) {
    try {
      await file.mv(`${__dirname}/static/${hash}.${ext}`);
      dbFile = new DBFile({
        hash,
        name,
        mimetype,
        size: file.size,
      });
      await dbFile.save();
    } catch (error) {
      return rs.send(error);
    }
  }
  if (id) {
    const user = await User.findOne({ _id: id });
    user.files.push(dbFile.id);
    await user.save();
  }
  rs.send(`${FRONTEND}/${numToLetter(dbFile.id)}`);

});
app.delete('/:id', passport.authenticate('jwt', { session: false }), async (rq, rs) => {
  const id = lettersToNum(rq.params.id);
  const file = await DBFile.findById(id);
  if (file) {
    file.delete();
    const user = await User.findById(rq.user._id);
    user.files = user.files.filter(f => f !== String(id));
    await user.save();
  }
  rs.send('something was here, now it\'s gone');
});
app.put('/profile', passport.authenticate('jwt', { session: false }), async (rq, rs) => {
  const { newName } = rq.body;
  const user = await User.findById(rq.user._id);
  user.name = newName;
  await user.save();
  rs.send(newName);
});
/**
 * @param {number} num 
 * @returns {string} string
 */
function numToLetter(num) {
  if (isNaN(num)) {
    return NaN;
  }
  let quotient = Number(num) + 456_976;
  let number = [];
  let alphabet = 'abcdefghijklmnopqrstuvwxyz';
  do {
    const remainder = quotient % 26;
    quotient = Math.floor(quotient / 26);
    number.push(alphabet[remainder]);
  } while (quotient);
  return number.reverse().join('');
}

/**
 * @param {string} letters 
 * @returns {number}
 */
function lettersToNum(letters) {
  if (!/^[a-z]+$/.test(letters)) {
    return -1;
  }
  return letters
    .split('')
    .reverse()
    .map(char => 'abcdefghijklmnopqrstuvwxyz'.indexOf(char))
    .reduce((acc, cur, idx) => acc + cur * 26 ** idx)
    - 456_976;
}


app.get('/:id', async (rq, rs, next) => {
  const { id } = rq.params;
  const dbId = lettersToNum(id.toLowerCase());
  const file = await DBFile.findOne({ _id: dbId });
  if (!file) {
    return next();
  }
  return rs.sendFile(`${__dirname}/static/${[file.hash, file.name.split('.').pop()].join('.')}`);
});

// 404 route
app.get('/*', (_, rs) => {
  rs.status(404).json({ message: 'Data not found' });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
