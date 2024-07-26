const express = require('express');
const router = express.Router();
const user = require('../model/user');

// 회원 정보 수정 라우터
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

// 회원 탈퇴 라우터
router.delete('/mypage/:userId', async (req, res) => { 
 // mypage.js에서 /mypage/${userData.user_id}라고 경로 정의함 ->>  :userId는 URL의 일부로 전달되는 경로 매개변수
    const userId = req.params.userId;   // URL경로에서 userId 값을 추출하여 userId 변수에 저장

    try {
        console.log('회원 탈퇴 요청:', userId);
        user.delete(userId, (err, results) => {  // db에서 해당 userId를 가진 사용자 삭제
            if (err) {
                console.error('회원 탈퇴 에러:', err);
                return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
            console.log('회원 탈퇴 결과:', results);
            res.json({ message: '회원 탈퇴가 성공적으로 완료되었습니다!' }); 
        });
    } catch (err) {
        console.error('회원 탈퇴 중 예외 발생:', err); 
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});


module.exports = router;