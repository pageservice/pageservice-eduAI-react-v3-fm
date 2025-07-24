// server/routes/admin.js
import express from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';
import {upload,uploadVideo} from '../middlewares/cloudinaryUploader.js'; // ✅← 추가할 부분
import { getDashboardStats, getAllUsers,uploadImage, getImages, deleteImage,uploadVideoFile,getVideos } from '../controllers/adminController.js';  // ✅✅ ← deleteImage 추가할 부분

const router = express.Router();

router.use(authMiddleware, isAdmin); // 인증 + 관리자 권한 필수

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);

router.post('/upload-image', upload.single('file'), uploadImage);         // ✅← 추가할 부분
router.get('/images', getImages);                  // ✅ ← 추가할 부분
router.post('/delete-image', deleteImage); // ✅✅ ←  POST 요청으로 업로드 된 이미지 삭제
router.post('/upload-video', authMiddleware, uploadVideo.single('file'), uploadVideoFile);
router.get('/videos', getVideos);  
export default router;