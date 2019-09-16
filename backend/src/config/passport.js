import dotenv from 'dotenv';
dotenv.config();
import User from '../models/userModel';
const googleStrategy = require('passport-google-oauth20');

export default passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });

  passport.use(
    new googleStrategy(
      {
        callbackURL: `${process.env.ROOT_URL}/api/${process.env.APP_V}/auth/google/redirect`,
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, email, done) => {
        User.findOne({ email: email.emails[0].value }).then(currentUser => {
          if (currentUser) {
            req.user = currentUser;
            done(null, currentUser);
          } else {
            done({ message: 'User not found!' }, false);
          }
        });
      }
    )
  );
};
