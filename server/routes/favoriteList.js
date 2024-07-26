const express = require("express");
const router = express.Router();
const favorite = require("../model/favorite");
// 즐겨찾기 항목 추가 또는 업데이트
router.post('/add', (req, res) => {
    const { userId, foodIdx } = req.body;

    if (!userId || !foodIdx) {
        return res.status(400).json({ message: 'userId와 foodIdx는 필수입니다.' });
    }

    favorites.addFavorite(userId, foodIdx, (err, result) => {
        if (err) {
            console.error('즐겨찾기 추가 오류:', err);
            return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }

        res.json({ message: '즐겨찾기에 추가되었습니다.', result });
    });
});

// 즐겨찾기 항목 삭제
router.post('/remove', (req, res) => {
    const { userId, foodIdx } = req.body;

    if (!userId || !foodIdx) {
        return res.status(400).json({ message: 'userId와 foodIdx는 필수입니다.' });
    }

    favorites.removeFavorite(userId, foodIdx, (err, result) => {
        if (err) {
            console.error('즐겨찾기 삭제 오류:', err);
            return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }

        res.json({ message: '즐겨찾기에서 삭제되었습니다.', result });
    });
});

module.exports = router;