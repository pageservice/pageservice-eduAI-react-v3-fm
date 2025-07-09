// server/index.js
/*
import express from 'express';

const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Hello from Express');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
*/
// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';

dotenv.config();
const app = express();
const whitelist = [
  'http://localhost:5173',                        // 로컬 프론트엔드 실행 주소
  'https://eduai-react-v3-fm.vercel.app'          // 정식 배포 주소도 함께 허용
];
app.use(cors({ origin: whitelist, credentials: true })); 
//app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
//app.use(cors({ origin: 'https://eduai-react-v3-fm.vercel.app', credentials: true })); //✅RENDER 프론트엔드 서버요청주소✅
app.use(express.json());

// 라우터 연결
app.use('/api/auth', authRoutes);
app.use('/api', courseRoutes); // /api/courses, /api/favorites

// DB 연결 후 서버 실행
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB 연결 성공');
    app.listen(5000, () => {
      console.log('✅ 서버 실행 중: http://localhost:5000');
    });
  })
  .catch((err) => console.error('❌ DB 연결 실패:', err));