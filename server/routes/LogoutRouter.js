const express = require('express');
const router = express.Router();
const user = require('../model/user');

// 로그아웃 라우터 추가
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: '로그아웃 도중 오류가 발생했습니다.' });
    }
    res.json({ message: '로그아웃이 성공적으로 완료되었습니다.' });
  });
});

module.exports = router;
