import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import appConfig from '../config/app.config';

passport.use(
  new Strategy(
    {
      secretOrKey: appConfig.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
