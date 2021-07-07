import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const connectionString = process.env.NODE_ENV === 'production'
  ? process.env.DB_URL
  : 'mongodb://localhost/fileStore';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});
const AutoIncrement = AutoIncrementFactory(mongoose);

const fileSchema = new mongoose.Schema({
  _id: Number,
  userId: String,
  hash: String,
  name: String,
  mimetype: String,
  size: Number,
  uploadedAt: {
    type: Date,
    default: Date.now
  },
});
fileSchema.plugin(AutoIncrement);
export const DBFile = mongoose.model('File', fileSchema);
