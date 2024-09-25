const express = require('express');
const router = express.Router();
const foods = require('../model/foods'); // foods.js에서 함수 불러오기

// 음식 인덱스로 조회하는 API
router.get('/foods/find', (req, res) => {
    const food_idx = req.query.food_idx; // 클라이언트에서 전달된 food_idx 받기
    if (!food_idx) {
        return res.status(400).send('food_idx가 필요합니다.');
    }
    
    // foods 모델에서 해당 인덱스를 가진 음식을 조회
    foods.findFoodByIdx(food_idx, (err, results) => {
        if (err) {
            return res.status(500).send('서버 오류');
        }
        if (results.length === 0) {
            return res.status(404).send('해당 음식이 없습니다.');
        }
        res.status(200).json(results[0]); // 결과를 클라이언트에 반환
    });
});

module.exports = router;