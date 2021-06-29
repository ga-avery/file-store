import '../utils/shims';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models';
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const JWT_STRATEGY = new Strategy(options, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    console.error('[passport]', error);
  }
});

export default async passport => {
  passport.use(JWT_STRATEGY);
};