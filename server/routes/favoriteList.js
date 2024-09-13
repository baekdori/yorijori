const express = require('express');
const router = express.Router();
const favorite = require('../model/favorite'); // 이 모듈이 데이터베이스와 연결됨

// 북마크 추가
router.post('/add', async (req, res) => {
  const { user_Id, food_Idx, food_name } = req.body;
  if (!user_Id || !food_Idx || !food_name) {
    return res.status(400).json({ message: '필수 데이터가 없습니다.' });
  }
  try {
    await favorite.addFavorite(user_Id, food_Idx, food_name);
    res.json({ message: '즐겨찾기가 추가되었습니다.' });
  } catch (error) {
    console.error('즐겨찾기 추가 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 북마크 제거
router.post('/remove', async (req, res) => {
  const { user_Id, food_Idx, food_name } = req.body;
  try {
    await favorite.removeFavorite(user_Id, food_Idx, food_name);
    res.json({ message: '즐겨찾기가 제거되었습니다.' });
  } catch (error) {
    console.error('즐겨찾기 제거 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 즐겨찾기 확인
router.get('/check', (req, res) => {
  const { user_Id, food_Idx, food_name } = req.query;
  if (!user_Id || !food_Idx || !food_name) {
    return res.status(400).json({ message: 'userId와 foodIdx는 필수입니다.' });
  }
  favorite.checkFavorite(user_Id, food_Idx, (err, isFavorite) => {
    if (err) {
      console.error('즐겨찾기 확인 오류:', err);
      return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
    res.json({ isFavorite });
  });
});

// 특정 사용자의 즐겨찾기 목록 반환
router.get('/list', async (req, res) => {
  const { user_Id } = req.query;
  if (!user_Id){
    return res.status(400).json({message : 'user_Id가 필요합니다.'});
  }
  try{
    favorite.getFavoriteByUser(user_Id, (err, results) => {
      if(err){
        console.error('즐겨찾기 목록 불러오기 오류', error);
        res.status(500).json({message : '서버 오류가 발생했습니다.'});
      }
      res.json(results) // 조회된 즐겨찾기 목록 반환
    });
  }catch(error){
    console.error('즐겨찾기 목록 반환 오류 : ', error);
    res.status(500).json({message : '서버 오류가 발생했습니다.'});
  }
});

module.exports = router;