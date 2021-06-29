import '../utils/shims';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/mernAuth', {
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
