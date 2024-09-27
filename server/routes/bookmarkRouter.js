// bookmarkRouter.js
const express = require('express');
const router = express.Router();
const bookmark = require('../model/bookmark');

// 북마크 토글 API
router.post('toggle', (req, res) => {
    const { userId, foodIdx } = req.body;

    if(!userId || !foodIdx){
        return res.status(400).send('user_id 또는 food_idx이 없습니다.');
    }

    // 현재 북마크 여부 확인
    bookmark.checkBookmark(userId, foodIdx, (err, isFavorited) => {
        if (err) {
            console.error('북마크 확인 오류 : ', err);
            return res.status(500).send('서버 에러');
        }

        if (isFavorited) {
            bookmark.removeBookmark(userId, foodIdx, (err, result) => {
                if (err) {
                    console.error('북마크 해제 오류 : ', err);
                    return res.status(500).send('서버 에러');
                }
                res.send('북마크 해제 성공!')
            });
        } else {
            
            // 북마크 추가
            bookmark.addBookmark(userId, foodIdx, (err, result) => {
                if (err) {
                    console.error('북마크 추가 오류 : ', err);
                    return res.status(500).send('서버 에러');
                }
                res.send('북마크 추가 성공!')
            });
        }
    });
});

// 북마크 추가
router.post('/add', async (req, res) => {
    const { user_Id, food_Idx, food_name } = req.body;
    if(!user_Id || !food_Idx || !food_name) {
        return res.status(400).json({ message : '필수 데이터가 없습니다.' });
    }
    try{
        await bookmark.addBookmark(user_Id, food_Idx, food_name);
        res.json({ message : '북마크 추가 완료 :  즐겨찾기 목록에 추가되었습니다.' });
    }catch (error) {
        console.error('즐겨찾기 추가 오류 : ', error);
        res.status(500).json({ message : '서버 오류가 발생했습니다.' });
    }
});

// 북마크 제거
router.post('/remove', async (req, res) => {
    const { user_Id, food_Idx, food_name } = req.body;
    try{
        await bookmark.removeBookmark(user_Id, food_Idx, food_name);
        res.json({ message : '북마크 제거 완료 : 즐겨찾기 목록에서 제거되었습니다.' });
    } catch (error) {
        console.error('즐겨찾기 제거 오류 : ', error);
        res.status(500).json({ messgae : '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;