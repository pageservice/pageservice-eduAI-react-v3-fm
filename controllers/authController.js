//server\controllers\authController.js
import jwt from 'jsonwebtoken'; // ✅✅ 토큰 발급
import User from '../models/User.js';


export const register = async (req, res) => {
  const { email, password, username } = req.body; // ✅ username도 포함
  const exists = await User.findOne({ email });

  if (exists) {
    return res.status(409).json({ message: '이미 등록된 이메일입니다.' });
  }

  const newUser = new User({ email, password, username }); // ✅ 사용자 생성
  await newUser.save();

  // ✅ JWT 토큰 발급
  const token = jwt.sign(
    { userId: newUser._id },              // payload
    process.env.JWT_SECRET,              // 비밀 키
    { expiresIn: '1d' }                  // 만료 시간
  );

  // ✅ 토큰과 사용자 정보 응답
  res.status(201).json({
    token,
    user: {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username
    }
  });


  console.log('🔍 서버 수신 데이터:', req.body);
  console.log("✅ 토큰:", token);
};

/*
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
  }

  res.status(200).json({ message: '로그인 성공', user });
};
*/
//  ✅✅✅로그인 함수 -------------------------------------------------------
  export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
      // 사용자 확인
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다.' });
      }

      // ✅ JWT 토큰 발급
      const token = jwt.sign(
        { userId: user._id },               // payload
        process.env.JWT_SECRET,            // 비밀 키
        { expiresIn: '1d' }                // 만료 시간
      );

      // ✅ 응답에 토큰 포함
      res.status(200).json({
        message: '로그인 성공',
        token,
        user: {
          _id: user._id,
          email: user.email,
          username: user.username
        }
      });
    } catch (err) {
      console.error('❌ 로그인 오류:', err);
      res.status(500).json({ message: '로그인 처리 중 오류 발생' });
    }
  };

export const logout = (req, res) => {
  // JWT를 저장한 쿠키를 삭제
  res.clearCookie('token', {
    httpOnly: true,
    secure: true, // HTTPS 환경에서만 쿠키 전달
    sameSite: 'None', // 크로스 도메인일 경우 필요
  });
  res.status(200).json({ message: '로그아웃 완료' });
};

export const getMe = async (req, res) => {
  res.status(200).json({ message: '사용자 정보 조회' });
};
