import passport from 'passport';
import { Strategy } from 'passport-local';
import { UniqueConstraintError } from 'sequelize';
import HttpError from '../errors/http.error';
import HttpStatus from '../models/enums/http-status.enum';
import User from '../models/user.model';

passport.use(
  'register',
  new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.create({ email, password });

        return done(null, { id: user.id, email: user.email });
      } catch (error) {
        // handle duplicated emails
        if (error instanceof UniqueConstraintError) {
          return done(
            new HttpError(HttpStatus.CONFLICT, 'Email is already in use.'),
          );
        }

        return done(error);
      }
    },
  ),
);

passport.use(
  'login',
  new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.checkUser(email, password);

        if (!user) {
          return done(
            new HttpError(
              HttpStatus.UNAUTHORIZED,
              'Invalid email or password.',
            ),
          );
        }

        return done(
          null,
          { id: user.id, email: user.email },
          { message: 'Logged in successfully.' },
        );
      } catch (error) {
        return done(error);
      }
    },
  ),
);
