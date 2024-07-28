const express = require("express");
const router = express.Router();
const foods = require('../model/foods'); // foods 모델을 불러옴

// 게시글 삭제 라우터 (DELETE 요청)
router.delete('/', (req, res) => {
    const { food_idx, user_id } = req.query; // 쿼리 파라미터로 food_idx와 user_id를 받음

    console.log('게시글 삭제 요청:', food_idx, user_id);

    // 데이터베이스에서 게시글 삭제
    foods.postdelete(food_idx, user_id, (err, results) => {
        if (err) {
            // 데이터베이스 삭제 중 오류 발생 시 서버 오류 응답 반환
            console.error('에러 발생:', err);
            return res.status(500).json({ message: '데이터 삭제 중 오류가 발생했습니다.' });
        } else {
            // 데이터 삭제 성공 시 성공 응답 반환
            return res.status(200).json({ message: '데이터가 성공적으로 삭제되었습니다.', data: results });
        }
    });
});

module.exports = router;
