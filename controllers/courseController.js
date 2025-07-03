//server\controllers\courseController.js
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Favorite from '../models/Favorite.js';

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: '강의 목록을 불러오지 못했습니다.' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: '강의를 찾을 수 없습니다.' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: '강의 상세 정보를 불러오지 못했습니다.' });
  }
};

// ✅✅✅ 찜 등록 / 해제 (토글)
export const addFavorite = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;

  try {
    // ✅ 문자열 형태의 courseId를 ObjectId로 변환
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    // ✅ userId + courseId 쌍으로 존재하는지 확인
    const exists = await Favorite.findOne({ userId, courseId: courseObjectId });

    if (exists) {
      await Favorite.deleteOne({ userId, courseId: courseObjectId });
      return res.status(200).json({ message: '찜 해제 완료' });
    } else {
      await Favorite.create({ userId, courseId: courseObjectId });
      return res.status(201).json({ message: '찜 등록 완료' });
    }
  } catch (err) {
    console.error('❌ 찜 등록 중 오류:', err);
    res.status(500).json({ message: '찜 처리 중 오류 발생' });
  }
};

// ✅✅✅ 찜한 강의 목록 조회
// getFavorites 찜목록 조회(가져오기)
export const getFavorites = async (req, res) => {
  const userId = req.user._id;

  try {
    const favorites = await Favorite.find({ userId }).populate('courseId');
    const courseList = favorites.map(f => f.courseId);
    res.json(courseList);
  } catch (err) {
    res.status(500).json({ message: '찜 목록을 불러오지 못했습니다.' });
  }
};