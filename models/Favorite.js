//server\models\Favorite.js
import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ 하나의 유저가 동일한 강의를 중복 찜하지 않도록 복합 유니크 인덱스 설정
favoriteSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);

