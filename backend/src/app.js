import express from 'express';
import path from 'path';
import logger from 'morgan';
import passport from 'passport';
import authInitializer from './config/passport';
import cloudinary from 'cloudinary';
import router from './routes/index'
import passportIOConfigs from './config/passportIOConfigs';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const {APP_V} = process.env;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [
      'https://be-on-board-test.herokuapp.com',
      'https://beonoboard.herokuapp.com',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(passportIOConfigs.secret));
app.use(passportIOConfigs);
app.use(passport.initialize());
app.use(passport.session());
authInitializer(passport);

app.use(`/api/${APP_V}`, router());
app.use(function(err, req, res, next) {
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.end();
});

module.exports = app;
