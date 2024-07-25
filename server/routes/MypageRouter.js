const express = require('express');
const router = express.Router();
const user = require('../model/user');

// 회원정보 수정 요청 처리
router.put('/mypage', async (req, res) => {
    const { user_id, user_nick, user_phone, user_email } = req.body;  // 사용자 정보 추출

    try {
        // 업데이트할 사용자 정보 객체 생성
        const updateInfo = { user_nick, user_phone, user_email };
        console.log('업데이트 요청 데이터:', updateInfo);

        // 사용자 정보 업데이트
        user.update(user_id, updateInfo, (err, results) => {
            if (err) {
                console.error('회원정보 수정 에러:', err); 
                return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
            console.log('회원정보 수정 결과:', results);
            res.json({ message: '회원정보가 성공적으로 수정되었습니다!' });
        });
    } catch (err) {
        console.error('회원정보 수정 중 오류 발생:', err);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

model.exports = router;