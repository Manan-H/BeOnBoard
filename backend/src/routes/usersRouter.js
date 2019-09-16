import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import userController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddlware';
import cloudinaryUpload from '../middlewares/cloudinaryUpload';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const baseUrl = `/users`;
const router = express.Router({mergeParams: true});


// for admin
router.put(
  `${baseUrl}/mark-notifications-as-seen`,
  authMiddleware,
  userController.markNotificationsAsSeen
);

router.post(baseUrl, authMiddleware, userController.createUser);

router.get(`${baseUrl}/profile`, authMiddleware, userController.getUserProfile);

router.put(baseUrl, authMiddleware, userController.editUserProfile);

router.put(
  `${baseUrl}/photos`,
  authMiddleware,
  upload.any(),
  cloudinaryUpload,
  userController.setPhotos
);

// for admin
router.put(
  `${baseUrl}/:userId`,
  authMiddleware,
  userController.editUserProfile
);

// for admin
router.delete(`${baseUrl}/:userId`, authMiddleware, userController.deleteUser);

router.put(`${baseUrl}/take-quiz`, authMiddleware, userController.takeQuiz);

router.get(
  `${baseUrl}/get-notifications`,
  authMiddleware,
  userController.getNotificationsById
);

router.get(`${baseUrl}/:userId`, authMiddleware, userController.getUserById);

router.get(baseUrl, authMiddleware, userController.getUsers);

router.get(
  `${baseUrl}/is-email-unique/:email`,
  authMiddleware,
  userController.isEmailUnique
);

router.post(`${baseUrl}/verify-url`, authMiddleware, userController.verifyUrl);

export default router;
