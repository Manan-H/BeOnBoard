import dotenv from 'dotenv';
dotenv.config();
import adminData from '../../admin';
import request from 'request';

request.post(
  {
    url: `http://${process.env.HOST}:${process.env.PORT}/api/${process.env.APP_V}/users`,
    json: true,
    body: adminData,
  },
  err => {
    if (err) {
      console.log('createAdmin::Error', err);
      return;
    }
    console.log('Admin has successfully been created!');
  }
);
