import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  timesLoggedIn: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now()
  },
});
export const User = mongoose.model('User', userSchema);
