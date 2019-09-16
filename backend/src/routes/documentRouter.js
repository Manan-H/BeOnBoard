import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import documentController from '../controllers/documentController';
import authMiddleware from '../middlewares/authMiddlware';
import multer from 'multer';
import { MAX_FILE_SIZE } from '../config/fileUpload';
import handleFileSizeError from '../middlewares/handleFileSizeError';
import cloudinaryUpload from '../middlewares/cloudinaryUpload';

const tempUpload = multer({ dest:'temp/', limits: { fileSize: MAX_FILE_SIZE } });
const baseUrl = `/documents`;
const router = express.Router({mergeParams: true});

router.get(baseUrl, authMiddleware, documentController.getDocuments);

router.post(
  baseUrl, 
  authMiddleware, 
  tempUpload.any(), 
  handleFileSizeError,
  cloudinaryUpload, 
  documentController.postDocuments
);

router.delete(`${baseUrl}/:id`, authMiddleware, documentController.deleteDocuments);

export default router;
