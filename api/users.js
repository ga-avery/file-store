import '../utils/shims';
import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
const JWT_SECRET = process.env.JWT_SECRET;

import { User } from '../models';


const test = async (_, rs) => {
  rs.json({ message: 'User endpoint OK!' });
};

const signup = async (rq, rs) => {
  console.log('--- inside of signup ---');
  console.log('rq.body', rq.body);
  const { name, email, password } = rq.body;
  try {
    // see if a user exists in db by email
    const user = await User.findOne({ email });
    // if user already exists, 400 error and message
    if (user) {
      return rs.status(400).json({ message: 'email already exists' });
    }
    console.log('Create new user');
    const newUser = new User({ name, email, password });
    try {
      await newUser.validate();
    } catch (error) {
      if (error.errors?.password) {
        const err = error.errors.password;
        if (err.kind === 'minlength') {
          return rs.json({ message: 'password too short' });
        }
        return rs.json({ message: `password: ${err.kind}` });
      }
      console.error(error);
      return rs.json({ message: 'unknown validation error' });
    }
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    newUser.password = hash;
    const savedUser = await newUser.save();
    rs.json(savedUser);
  } catch (error) {
    console.error('[/api/users/signup]', error, '[signup]');
    return rs.status(400).json({ message: 'error occurred, please try again' });
  }
};

const login = async (rq, rs) => {

  const { email, password } = rq.body;
  try {
    // find email
    const user = await User.findOne({ email });
    if (!user) {
      return rs.status(400).json({ message: 'email or password incorrect' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('password correct:', isMatch);
    if (!isMatch) {
      return rs.status(400).json({ message: 'either email or password is incorrect' });
    }
    user.timesLoggedIn++;
    await user.save();
    // create token payload
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      expiredToken: Date.now()
    };
    try {
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
      console.log('token', token);
      const legit = jwt.verify(token, JWT_SECRET, { expiresIn: '1m' });
      return rs.json({
        success: true,
        token: `Bearer ${token}`,
        userData: legit,
      });
    } catch (error) {
      console.error('[token verify]', error);
      rs.status(400).json({ message: 'session has ended, please log in' });
    }
  } catch (error) {
    console.error('[/api/users/login]', error);
  }
};

const profile = async (rq, rs) => {
  console.log('inside of profile route');
  rs.json({
    id: rq.user.id,
    name: rq.user.name,
    email: rq.user.email,

  });
};

router.get('/test', test);
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', passport.authenticate('jwt', { session: false }), profile);
export default router;