// server/controllers/adminController.js
import User from '../models/User.js';
import Image from '../models/Image.js';// 이미지 업로드 컨트롤러
import cloudinary from '../config/cloudinary.js'; //추가0✅✅✅ ← 누락된 cloudinary import

export const getDashboardStats = async (req, res) => {
  const userCount = await User.countDocuments();
  res.json({ userCount });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find({}, '-password'); // 비밀번호 제외
  res.json(users);
};

// ✅이미지 업로드 컨트롤러
export const uploadImage = async (req, res) => {
  try {
    console.log('📂 req.file:', req.file);  // ← 파일 업로드 여부 확인용
    const url = req.file?.path;
    const public_id = req.file?.filename; // Cloudinary가 생성한 ID

    const newImage = new Image({
      url,
      public_id,
      uploadedBy: req.user?.id, // 인증된 사용자 ID (isAuth로부터)
    });

    await newImage.save();

    res.json({ url });
  } catch (err) {
    console.error('❌ 이미지 업로드 실패:', err); // 로그 필수 !  
    res.status(500).json({ error: '이미지 업로드 실패' });
  }
};

// 이미지 목록 불러오기 컨트롤러
export const getImages = async (req, res) => {
  try {
    console.log('🔍 이미지 리스트 요청 by1111111', req.user?.id);  // 추가1 로그 필수!

    /*
     //✅✅ 기존 Cloudinary 직접 호출 방식 (사용 안함, 주석처리)
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'admin-uploads/',
        max_results: 30,
        sort_by: 'created_at:desc', // ← 추가 옵션
      });
      console.log(result.resources[0]);
      res.json(result.resources); // 배열 반환
   */

    
    // ✅✅ 수정된 MongoDB 조회 방식
    const images = await Image.find().sort({ createdAt: -1 }); // 최신순 정렬
    console.log('📦 MongoDB에서 불러온 이미지 수:', images.length); // ✅ 개수 로그
    res.json(images); // 배열 반환
   
    

  } catch (err) {
    // res.status(500).json({ error: 'Cloudinary 이미지 조회 실패' });
    //    로그 필수!
    console.error('❌ Cloudinary API 오류:', err); // ← 핵심 로그 
    res.status(500).json({ error: 'Cloudinary 이미지 조회 실패', detail: err.message });
  }

  
};
// ✅이미지 삭제 컨트롤러
export const deleteImage = async (req, res) => {
  const { public_id } = req.body;
  console.log('🗑 삭제 요청됨: ', public_id); // ← 로그 추가
  try {
    // ✅ 1. Cloudinary에서 이미지 삭제
    const result = await cloudinary.uploader.destroy(public_id);

    // ✅ 2. MongoDB에서도 해당 이미지 문서 삭제
    await Image.findOneAndDelete({ public_id });

    res.json({ success: true, result });
  } catch (err) {
    console.error('❌ 이미지 삭제 실패:', err);
    res.status(500).json({ success: false, message: '이미지 삭제 실패', detail: err.message });
  }
};