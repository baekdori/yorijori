// csRouter.js
const express = require('express');
const router = express.Router();
const comts = require('../model/comts');

// 댓글 조회 라우터 (GET 요청)
router.get('/', (req, res) => {
    const { food_idx } = req.query;

    // 필수 데이터가 없는 경우 바로 반환
    if (!food_idx) {
        return res.status(400).json({ error: 'food_idx는 필수입니다.' });
    }

    // 댓글 조회
    comts.comtssee(food_idx, (err, result) => {
        if (err) {
            console.error('서버 오류 발생:', err);
            return res.status(500).send('서버 오류 발생');
        }

        return res.json(result);
    });
});

module.exports = router;