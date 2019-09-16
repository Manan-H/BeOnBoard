require('dotenv').config();
import express from 'express';
import homeController from '../controllers/homeController';
import authMiddleware from '../middlewares/authMiddlware';
import multer from 'multer';

const tempUpload = multer({ dest:'temp/' });
const router = express.Router({mergeParams: true});

const baseUrl = `/`;

router.post(`${baseUrl}upload`, authMiddleware, tempUpload.single('file'), homeController.uploadImage);

router.post(
  `${baseUrl}upload/:id`,
  authMiddleware,
  tempUpload.single('file'),
  homeController.uploadProfileImage
);

export default router;
