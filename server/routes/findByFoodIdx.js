// findByFoodIdx.js
const express = require('express');
const router = express.Router();
const db = require('../model/db'); // DB 연결 설정

// food_idx로 Foods 테이블에서 데이터 조회
router.get('/', async (req, res) => {
    const food_idx = req.query.food_idx; // 쿼리에서 food_idx를 가져옴
    if (!food_idx) {
        return res.status(400).json({ message: 'food_idx is required' }); // food_idx가 없을 경우
    }

    try {
        const query = 'SELECT * FROM Foods WHERE food_idx = ?'; // SQL 쿼리 작성
        const [results] = await db.execute(query, [food_idx]); // DB 쿼리 실행
        if (results.length > 0) {
            res.json(results); // 데이터가 존재하면 반환
        } else {
            res.status(404).json({ message: 'Food not found' }); // 데이터가 없으면 404 반환
        }
    } catch (error) {
        console.error('Database error:', error); // 오류 로그 출력
        res.status(500).json({ message: 'Internal Server Error' }); // 서버 오류 처리
    }
});

module.exports = router;