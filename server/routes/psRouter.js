const express = require('express');
const router = express.Router();
const foods = require('../model/foods'); // foods 모델을 불러옴

// 게시글 상세 조회 API
router.get('/', (req, res) => {
    const { food_idx } = req.params;
    
    foods.postsee(food_idx, (err, result) => {
        if (err) {
            res.status(500).send('서버 오류 발생');//에러발생시
        } else {
            res.json(result[0]); // 조회된 게시글 정보를 JSON으로 응답
        }
    });
});

module.exports = router;
