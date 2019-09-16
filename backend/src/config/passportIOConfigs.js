import expressSession from 'express-session';
import connectMongo from 'connect-mongo';

export default expressSession({
  store: new (connectMongo(expressSession))({
    url: process.env.MONGODB_URI,
  }),
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
});
