import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authController from '../controllers/authController';
const router = express.Router({mergeParams: true});
const passport = require('passport');

const baseUrl = `/auth/google`;

router.get(
  baseUrl,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  `${baseUrl}/redirect`,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
  authController.redirectUser
);

router.get(`${baseUrl}/logout`, authController.logoutUser);

export default router;
