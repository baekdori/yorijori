const express = require('express');
const User = require('../model/ingredients');
const router = express.Router();

// 재료를 기반으로 음식 검색
router.get('/', (req, res) => {
    const ingredientName = req.query.q || ''; // 쿼리 파라미터에서 검색어 추출

    ingredients.searchFoodsByIngredient(ingredientName, (err, results) => {
        if (err) {
            console.error('Error fetching foods by ingredient:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // 결과 반환
        res.json(results);
    });
});

module.exports = router;