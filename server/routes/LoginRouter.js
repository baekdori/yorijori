const express = require('express');  // Express 모듈을 가져옴
const router = express.Router();  // 라우터 객체 생성하여 경로 처리에 사용
const user = require('../model/user');  // 사용자 관련 데이터베이스 작업을 처리하는 모델 불러옴
const bcrypt = require('bcrypt');   // bcrypt 모듈을 가져옴 (비밀번호 해싱 및 비교를 위해 사용)
// bcrypt : 비밀번호를 안전하게 해싱하고 저장하는데 사용되는 라이브러리
// 비밀번호 해싱(Hashing) : 사용자가 입력한 비밀번호를 해시 값으로 변환하여 DB에 저장
const app = express();  // Express 애플리케이션 객체 생성
const { sessionMiddleware, cookieParser } = require('../session');  // 세션 및 쿠키를 처리하는 미들웨어 불러옴
app.use(cookieParser);  // 쿠키 파서 미들웨어 사용 (쿠키 데이터를 파싱하여 req.cookies에 저장)
app.use(sessionMiddleware);  // 세션 미들웨어 사용 (세션 데이터를 req.session에 저장)

// 로그인 요청을 처리하고 사용자 인증
router.post('/', async (req, res) => {  // '/' 경로에 POST 요청이 들어오면 로그인 요청 처리
    const { user_id, user_pw } = req.body;   // 클라이언트에서 전달된 user_id와 user_pw 추출

    try {
        console.log('로그인 시도:', { user_id, user_pw });  // 로그인 시도 로그 출력

        // 사용자 아이디 조회
        const foundUser = await user.findByUsername(user_id);  // 데이터베이스에서 user_id에 해당하는 사용자 조회

        if (!foundUser) {  // 사용자가 존재하지 않는 경우
            console.log('사용자를 찾을 수 없습니다:', user_id);  // 사용자 없음 로그 출력
            return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });  // 400 상태 코드와 메시지 반환
        } 

        // 비밀번호 확인
        const isMatch = await bcrypt.compare(user_pw, foundUser.user_pw); // 입력된 비밀번호와 DB에 저장된 해시된 비밀번호 비교
        if (!isMatch) {  // 비밀번호가 일치하지 않는 경우
            console.log('비밀번호 불일치:', user_id);  // 비밀번호 불일치 로그 출력
            return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });  // 400 상태 코드와 메시지 반환
        }

        // 세션에 사용자 정보 저장
        req.session.user = {  // 세션에 유저 정보를 저장
            user_id: foundUser.user_id,  // user_id 저장
            user_name: foundUser.user_name,  // user_name 저장
            user_nick: foundUser.user_nick,  // user_nick 저장
            user_email: foundUser.user_email  // user_email 저장
        };

        // 세션 저장 완료 후 응답
        req.session.save(err => {  // 세션 저장 후 콜백 함수 실행
            if (err) {  // 세션 저장 중 에러 발생 시
                return res.status(500).json({ message: "세션 저장 실패" });  // 500 상태 코드와 메시지 반환
            }
            res.json({ message: '로그인 성공', user: foundUser.user_id });  // 로그인 성공 시 성공 메시지와 사용자 정보 반환
        });

    } catch (err) {  // 서버 오류 발생 시 처리
        console.error('서버 오류 발생:', err);  // 서버 오류 로그 출력
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });  // 500 상태 코드와 에러 메시지 반환
    }
});

module.exports = router;  // 이 모듈을 외부에서 사용할 수 있도록 내보냄


// req.session.save() 비동기 처리
// 이전 문제:

// req.session.save()가 세션 저장을 비동기적으로 처리하는데, 기존 코드에서는 res.json()이 세션 저장이 완료되기 전에 호출될 수 있는 문제가 있었습니다.
// 만약 세션이 아직 저장되지 않은 상태에서 응답이 반환되면, 클라이언트는 세션이 제대로 설정되지 않은 상태가 됩니다.
// 변경 이유:

// 세션 저장 후에 응답을 반환하도록 비동기 처리 흐름을 명확하게 하기 위해 req.session.save() 내부에서 res.json()을 호출했습니다.
// 이렇게 하면 세션 저장이 완료된 후에만 응답이 클라이언트로 전달되므로, 세션이 누락되거나 저장되지 않는 문제를 방지할 수 있습니다.