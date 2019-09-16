import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import profileController from '../controllers/profileController';
import authMiddleware from '../middlewares/authMiddlware';

const baseUrl = `/profile`;
const router = express.Router({mergeParams: true});

router.get(baseUrl, authMiddleware, profileController.openProfile);

export default router;
