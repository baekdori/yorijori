const express = require('express');
const router = express.Router();
const path = require('path');
const user = require('../model/users');

// 회원가입 페이지 렌더링
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/join.html'));
});

// 회원가입 요청을 처리하고 사용자 정보를 DB에 저장
router.post('/', (req, res) => {
    // 회원가입 창에서 입력받은 데이터를 추출
    const { user_id, user_pw, user_name, user_nick, user_gender, user_phone, user_email } = req.body;
    
    // 비밀번호 일치하는지 확인
    if (user_pw !== check_pw) {
        return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });  // 오류 400번(클라이언트 요청 잘못됨)
    }

    // 사용자 정보 객체 생성
    const userInfo = { user_id, user_pw, user_name, user_nick, user_gender, user_phone, user_email };

    // 사용자 정보 저장
    // 서버 오류 없으면 저장 멘트 보여짐
    user.create(userInfo, (err, results) => {
        if (err) {
            console.error(err); 
            return res.status(500).json({ message: '서버 오류가 발생했습니다.' });  // 오류 500번(서버 요청 오류)
        }
        res.json({ message: '회원가입이 성공적으로 완료되었습니다!' });
    });
});

module.exports = router;
