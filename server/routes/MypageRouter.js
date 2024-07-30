const express = require('express');
const router = express.Router();
const user = require('../model/user');

// 인증 미들웨어
const authMiddleware = (req, res, next) => {
    console.log('인증 미들웨어 호출됨');
    console.log(`요청 URL: ${req.originalUrl}`);
    console.log(`요청 메서드: ${req.method}`);
    console.log(`요청 시간: ${new Date().toISOString()}`);

    // 세션 및 유저 정보 확인
    console.log('MypageRouter에서 세션 데이터 로그 출력:', req.session);
    if (req.session && req.session.user) {
        console.log('유저 인증 성공');
        console.log(`유저 ID: ${req.session.user.id}`);
        console.log(`유저 이름: ${req.session.user.name}`);
        next(); // 세션에 유저 정보가 있으면, 요청을 다음 미들웨어 또는 라우트로 넘김
    } else {
        res.status(401).json({ message: '인증이 필요합니다.' }); // 세션에 유저 정보가 없으면, 인증 오류 반환
    }
};


// 프로필 라우터에 인증 미들웨어 적용
router.get('/profile', authMiddleware, (req, res) => {
    const userId = req.session.user.user_id;
    console.log('프로필 정보 요청:', userId);

    user.getById(userId, (error, results) => {
        if (error) {
            console.error('프로필 정보 가져오기 오류:', error);
            return res.status(500).json({ message: '프로필 정보를 가져오는 중 오류가 발생했습니다.' });
        }

        if (results.length > 0) {
            console.log('프로필 정보 가져오기 성공:', results[0]);
            res.json(results[0]);
        } else {
            console.log('사용자 정보를 찾을 수 없음:', userId);
            res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
        }
    });
});

// // 프로필 라우터
// router.get('/profile', (req, res) => {
//     console.log('세션 확인:', req.session);
//     if (!req.session.user) {
//         console.log('로그인 필요');
//         return res.status(401).json({ message: '로그인이 필요합니다.' });
//     }

//     const userId = req.session.user.user_id;
//     console.log('프로필 정보 요청:', userId);

//     user.getById(userId, (error, results) => {
//         if (error) {
//             console.error('프로필 정보 가져오기 오류:', error);
//             return res.status(500).json({ message: '프로필 정보를 가져오는 중 오류가 발생했습니다.' });
//         }

//         if (results.length > 0) {
//             console.log('프로필 정보 가져오기 성공:', results[0]);
//             res.json(results[0]);
//         } else {
//             console.log('사용자 정보를 찾을 수 없음:', userId);
//             res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });
//         }
//     });
// });

// 회원 정보 수정 라우터
router.put('/', authMiddleware, async (req, res) => {
    const userId = req.session.user.user_id;
    const { user_id, user_nick, user_phone, user_email } = req.body;
    console.log('회원정보 수정 요청 데이터:', req.body);

    try {
        const updateInfo = { user_nick, user_phone, user_email };
        console.log('업데이트 요청 데이터:', updateInfo);

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

// // 회원 정보 수정 라우터
// router.put('/', async (req, res) => {
//     const { user_id, user_nick, user_phone, user_email } = req.body;  // 사용자 정보 추출
//     console.log('회원정보 수정 요청 데이터:', req.body);

//     try {
//         // 업데이트할 사용자 정보 객체 생성
//         const updateInfo = { user_nick, user_phone, user_email };
//         console.log('업데이트 요청 데이터:', updateInfo);

//         // 사용자 정보 업데이트
//         user.update(user_id, updateInfo, (err, results) => {
//             if (err) {
//                 console.error('회원정보 수정 에러:', err); 
//                 return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
//             }
//             console.log('회원정보 수정 결과:', results);
//             res.json({ message: '회원정보가 성공적으로 수정되었습니다!' });
//         });
//     } catch (err) {
//         console.error('회원정보 수정 중 오류 발생:', err);
//         res.status(500).json({ message: '서버 오류가 발생했습니다.' });
//     }
// });

// 회원 탈퇴 라우터
router.delete('/:userId', authMiddleware, async (req, res) => { 
    const userId = req.params.userId;
    console.log('회원 탈퇴 요청:', userId);

    try {
        user.delete(userId, (err, results) => {
            if (err) {
                console.error('회원 탈퇴 에러:', err);
                return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }
            console.log('회원 탈퇴 결과:', results);
            req.session.destroy((err) => {
                if (err) {
                    console.error('세션 삭제 중 오류 발생:', err);
                    return res.status(500).json({ message: '세션 삭제 중 오류가 발생했습니다.' });
                }
                res.json({ message: '회원 탈퇴가 성공적으로 완료되었습니다.' });
            });
        });
    } catch (err) {
        console.error('회원 탈퇴 중 예외 발생:', err); 
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// // 회원 탈퇴 라우터
// router.delete('/:userId', async (req, res) => { 
//     // mypage.js에서 /mypage/${userData.user_id}라고 경로 정의함 ->>  :userId는 URL의 일부로 전달되는 경로 매개변수
//     const userId = req.params.userId;   // URL경로에서 userId 값을 추출하여 userId 변수에 저장
//     console.log('회원 탈퇴 요청:', userId);

//     try {
//         user.delete(userId, (err, results) => {   // db에서 해당 userId를 가진 사용자 삭제
//             if (err) {
//                 console.error('회원 탈퇴 에러:', err);
//                 return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
//             }
//             console.log('회원 탈퇴 결과:', results);
//             req.session.destroy((err) => {
//                 if (err) {
//                     console.error('세션 삭제 중 오류 발생:', err);
//                     return res.status(500).json({ message: '세션 삭제 중 오류가 발생했습니다.' });
//                 }
//                 res.json({ message: '회원 탈퇴가 성공적으로 완료되었습니다.' });
//             });
//         });
//     } catch (err) {
//         console.error('회원 탈퇴 중 예외 발생:', err); 
//         res.status(500).json({ message: '서버 오류가 발생했습니다.' });
//     }
// });


module.exports = router;