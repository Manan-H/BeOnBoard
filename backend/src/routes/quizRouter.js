import express from 'express';
import quizController from '../controllers/quizController';
import quizResultsController from "../controllers/quizResultsController"
import authMiddleware from '../middlewares/authMiddlware';
import cloudinaryUpload from '../middlewares/cloudinaryUpload';
import multer from 'multer';

const tempUpload = multer({ dest: 'temp/' });
const baseUrl = `/quizzes`;
const baseUrlQuizHistory = `/quiz-history`;

const questionsBaseUrl = `${baseUrl}/:quizId/questions`;

const router = express.Router({mergeParams: true});

// quizzes

router.post(baseUrl, authMiddleware, quizController.createQuiz);

router.post(
  `${baseUrl}/photoquiz`,
  authMiddleware,
  tempUpload.any(),
  cloudinaryUpload,
  quizController.createPhotoQuiz
);

router.get(baseUrl, quizController.getAllQuizzes);

router.get(`${baseUrl}/:quizId`, authMiddleware, quizController.getQuizById);

router.delete(`${baseUrl}/:quizId`, authMiddleware, quizController.deleteQuiz);

router.put(`${baseUrl}/:quizId`, authMiddleware, quizController.editQuiz);

router.put(
  `${baseUrl}/set-active/:quizId`,
  authMiddleware,
  quizController.setActiveQuiz
);

// questions

router.get(
  questionsBaseUrl,
  authMiddleware,
  quizController.getQuestionsByQuizId
);

router.post(questionsBaseUrl, authMiddleware, quizController.createQuestion);

router.put(
  `${questionsBaseUrl}/:questionId`,
  authMiddleware,
  quizController.editQuestion
);

router.delete(
  `${questionsBaseUrl}/:questionId`,
  authMiddleware,
  quizController.deleteQuestion
);

//after taking quizz

router.post(`${baseUrl}/result`, authMiddleware, quizResultsController.analyzeQuiz);

//records

router.get(`${baseUrl}/records/:quizId`,  quizResultsController.getRecordsForQuiz)

//quizzes' scores' history
router.get(baseUrlQuizHistory, quizResultsController.getHistory)

export default router;
