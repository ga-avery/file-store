import '../utils/shims';
import mongoose from 'mongoose';

const connectionString = process.env.NODE_ENV === 'production'
  ? process.env.DB_URL
  : 'mongodb://localhost/fileStore';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});


const db = mongoose.connection;
db.once('open', () => {
  console.log(`connected to mongodb at ${db.host}:${db.port}`);
});
db.on('error', error => {
  console.error('[error]', 'database', error);
});

// export all models
export { User } from './User';
export { Book } from './Book';
export { DBFile } from './DBFile';
