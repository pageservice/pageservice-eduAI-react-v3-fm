import express from 'express';
import {
  getCourses,
  getCourseById,
  addFavorite,
  getFavorites,
} from '../controllers/courseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // // ✅✅✅ 찜 등록시 사용

const router = express.Router();

router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
// router.post('/favorites', addFavorite);
// router.get('/favorites', getFavorites);
router.post('/favorites', authMiddleware, addFavorite);  // ✅✅✅ 찜 등록/해제 보호
router.get('/favorites', authMiddleware, getFavorites);  // ✅✅✅ 찜 목록 보호

export default router;