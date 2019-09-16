import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import imageController from '../controllers/imageController';
import authMiddleware from '../middlewares/authMiddlware';
import cloudinaryUpload from '../middlewares/cloudinaryUpload';
import multer from 'multer';

const tempUpload = multer({ dest:'temp/' });
const baseUrl = `/images`;
const router = express.Router({mergeParams: true});

router.get(baseUrl, authMiddleware, imageController.getImages);

// router.get(`${baseUrl}/owner/:userId`, authMiddleware, imageController.getImagesByOwner);

router.post(
  baseUrl,
  authMiddleware, 
  tempUpload.any(), 
  cloudinaryUpload,
  imageController.postImages
);

router.put(`${baseUrl}/delete`, authMiddleware, imageController.deleteImages);

export default router;
