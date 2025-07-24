// server/middleware/cloudinaryUploader.js
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'admin-uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'video',              // ✅ 영상 전용
    folder: 'admin-videos',
    allowed_formats: ['mp4', 'mov', 'webm', 'mkv'],
  },
});

const uploadVideo = multer({ storage: videoStorage });

export { upload, uploadVideo };