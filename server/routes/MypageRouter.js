const express = require('express');  // Express 모듈을 가져옴
const router = express.Router();  // 라우터 객체를 생성하여 API 경로 설정에 사용
const user = require('../model/user');  // 사용자 관련 DB 작업을 처리하는 모델 파일을 불러옴

const app = express();  // Express 애플리케이션 객체 생성
const { sessionMiddleware, cookieParser } = require('../session');  // 세션과 쿠키를 처리하는 미들웨어 불러옴
app.use(cookieParser);  // 쿠키 파서 미들웨어 사용 (쿠키 데이터를 파싱하여 req.cookies에 저장)
app.use(sessionMiddleware);  // 세션 미들웨어 사용 (세션 데이터를 req.session에 저장)

// 인증 미들웨어 정의
const authMiddleware = (req, res, next) => {
    console.log('인증 미들웨어 호출됨');  // 인증 미들웨어가 호출된 시점을 로그로 출력
    console.log(`요청 URL: ${req.originalUrl}`);  // 요청된 URL을 로그로 출력
    console.log(`요청 메서드: ${req.method}`);  // 요청된 HTTP 메서드(GET, POST 등)를 로그로 출력
    console.log(`요청 시간: ${new Date().toISOString()}`);  // 요청 시각을 ISO 문자열 형식으로 로그로 출력

    // 세션 및 유저 정보 확인
    console.log('MypageRouter에서 세션 데이터 로그 출력:', req.session);  // 세션 데이터를 로그로 출력
    if (!req.session || !req.session.user) {  // 세션이 없거나 세션에 유저 정보가 없는 경우
        return res.status(401).json({ message: '인증이 필요합니다.' });  // 인증 실패 시 401 상태와 메시지를 반환
    }
    console.log('유저 인증 성공!');  // 유저 인증 성공 메시지를 로그로 출력
    next();  // 인증이 성공하면 다음 미들웨어로 넘어감
};

// 프로필 정보 조회 라우터 (로그인된 사용자만 접근 가능)
router.get('/profile', authMiddleware, (req, res) => {  // '/profile' 경로에 GET 요청 시 실행됨, authMiddleware 적용
    const userId = req.session.user.user_id;  // 세션에서 user_id를 가져옴
    console.log('프로필 정보 요청:', userId);  // 프로필 정보를 요청한 user_id를 로그로 출력

    // DB에서 userId에 해당하는 사용자 정보를 조회
    user.getById(userId, (error, results) => {  // user 모델의 getById 메서드로 사용자 정보 조회
        if (error) {  // DB 조회 중 에러가 발생한 경우
            console.error('프로필 정보 가져오기 오류:', error);  // 에러 내용을 로그로 출력
            return res.status(500).json({ message: '프로필 정보를 가져오는 중 오류가 발생했습니다.' });  // 500 상태와 에러 메시지를 반환
        }
        if (results.length === 0) {  // 조회 결과가 없는 경우 (해당 user_id에 해당하는 사용자가 없는 경우)
            console.log('사용자 정보를 찾을 수 없음:', userId);  // 사용자 정보를 찾을 수 없음을 로그로 출력
            return res.status(404).json({ message: '사용자 정보를 찾을 수 없습니다.' });  // 404 상태와 메시지를 반환
        }
        console.log('프로필 정보 가져오기 성공:', results[0]);  // 프로필 정보 조회 성공 로그 출력
        res.json(results[0]);  // 조회된 사용자 정보를 JSON 형식으로 응답
    });
});

// 회원 정보 수정 라우터 (로그인된 사용자만 접근 가능)
router.put('/edit', authMiddleware, (req, res) => {  // '/edit' 경로에 PUT 요청 시 실행됨, authMiddleware 적용
    const { user_id, user_nick, user_phone, user_email } = req.body;  // 클라이언트에서 전달된 수정할 사용자 정보를 req.body에서 추출
    const updateInfo = { user_nick, user_phone, user_email };  // 수정할 사용자 정보를 updateInfo 객체에 저장

    console.log('회원정보 수정 요청 데이터:', req.body);  // 수정 요청 데이터를 로그로 출력
    console.log('업데이트 요청 데이터:', updateInfo);  // 업데이트할 데이터를 로그로 출력

    // DB에서 user_id에 해당하는 사용자 정보를 updateInfo로 업데이트
    user.update(user_id, updateInfo, (err, results) => {  // user 모델의 update 메서드로 사용자 정보 업데이트
        if (err) {  // 업데이트 중 에러가 발생한 경우
            return res.status(500).json({ message: '회원 정보 수정 중 오류가 발생했습니다.' });  // 500 상태와 에러 메시지를 반환
        }
        res.json({ message: '회원 정보가 성공적으로 수정되었습니다!' });  // 성공적으로 수정되면 성공 메시지를 반환
    });
});

// 회원 탈퇴 라우터 (로그인된 사용자만 접근 가능)
router.delete('/delete', authMiddleware, async (req, res) => {  // '/delete' 경로에 DELETE 요청 시 실행됨, authMiddleware 적용
    const userId = req.body.user;  // 클라이언트에서 전달된 탈퇴할 사용자 ID를 req.body에서 추출
    console.log('회원 탈퇴 요청:', userId);  // 회원 탈퇴 요청 데이터를 로그로 출력

    // DB에서 userId에 해당하는 사용자를 삭제
    user.delete(userId, (err, results) => {  // user 모델의 delete 메서드로 사용자 삭제
        if (err) {  // 삭제 중 에러가 발생한 경우
            return res.status(500).json({ message: '회원 탈퇴 중 오류가 발생했습니다.' });  // 500 상태와 에러 메시지를 반환
        }
        res.json({ message: '회원 탈퇴가 성공적으로 완료되었습니다.' });  // 성공적으로 삭제되면 성공 메시지를 반환
    });
});

module.exports = router;  // 이 모듈을 외부에서 사용할 수 있도록 내보냄


// authmiddleware 적용 전 : 인증 확인이 없다:

// 라우터에 접근할 때 사용자가 로그인했는지, 즉 세션에 유저 정보가 있는지 확인하는 로직이 없습니다.
// 세션이 존재하지 않거나 만료된 사용자가 이 경로에 접근하더라도 오류를 발생시키지 않고, undefined와 같은 값으로 잘못된 요청이 진행될 수 있습니다.
// 결과적으로 인증되지 않은 사용자도 개인정보 조회, 수정, 탈퇴 요청을 보낼 수 있게 됩니다.
// 보안 취약성:

// 인증되지 않은 사용자도 /profile, /edit, /delete 등의 중요한 라우터에 요청을 보낼 수 있으므로, 개인정보와 같은 중요한 정보가 쉽게 노출될 수 있습니다.

// authMiddleware 적용의 장점
// 보안 강화:

// 가장 큰 장점은 보안 강화입니다. 사용자가 로그인하지 않은 상태에서 중요한 개인정보나 회원 정보 수정 기능에 접근할 수 없게 되어, 개인 정보 보호를 확실히 할 수 있습니다.
// 특히 회원 탈퇴, 개인정보 수정 같은 중요한 작업은 본인 인증이 필수이므로, authMiddleware를 통해 인증 절차가 강화됩니다.
// 코드 재사용성 증가:

// authMiddleware는 모든 인증이 필요한 경로에서 재사용할 수 있습니다. 각 라우터마다 개별적으로 세션 검사를 넣지 않고, 미들웨어로 처리하여 코드 중복을 줄이고 유지보수를 쉽게 할 수 있습니다.
// 사용자 경험 향상:

// 인증되지 않은 사용자에게 명확한 오류 메시지를 보내주기 때문에, 어떤 작업이 가능한지 아닌지에 대한 정보를 사용자에게 제공할 수 있습니다. 예를 들어, 401 에러가 발생하면 "로그인이 필요하다"는 메시지를 통해 사용자는 로그인을 먼저 해야 한다는 사실을 인지할 수 있습니다.
// 잘못된 요청 방지:

// 인증이 필요한 라우터에서 미들웨어가 적용되지 않으면 서버에서 잘못된 요청을 처리할 수 있습니다. 하지만 authMiddleware를 사용하면 인증되지 않은 사용자의 요청은 아예 서버에 전달되지 않고 차단되므로, 서버 자원 소모를 줄이고 잘못된 데이터 처리를 방지할 수 있습니다.
// 요약
// 적용 전: 모든 사용자가 인증 여부에 관계없이 라우터에 접근할 수 있어 보안에 취약하고, 인증되지 않은 사용자가 개인 정보에 접근할 수 있는 위험이 있습니다.
// 적용 후: 인증된 사용자만 라우터에 접근할 수 있어 보안이 강화되고, 서버가 불필요한 요청을 처리하지 않게 되어 서버 자원이 절약되며, 코드의 재사용성과 유지보수가 용이해집니다.

// Early Return 패턴
// 적용한 이유:
// 중요한 인증이나 데이터 유효성 검증을 할 때, 실패한 경우 즉시 처리해버리고, 더 이상 불필요한 작업이 이루어지지 않도록 하는 것이 효과적입니다.

// 코드의 명확성:
// 에러가 발생하면 그 즉시 반환하고, 정상 흐름은 에러 처리 없이 쭉 이어지게 되어 코드의 흐름이 자연스럽게 유지됩니다.
// 여러 if문이 중첩되어 있으면 가독성이 떨어지지만 Early Return 패턴을 사용하면 조건이 맞지 않으면 바로 반환/종료하고, 이후 코드에선 정상적인 로직의 흐름만 처리하므로 중첩된 블록을 줄일 수 있습니다.

// 유지보수 용이:
// 코드가 간결해지면 이후에 다른 개발자가 수정하거나 유지보수할 때 이해하기 쉬워지고, 버그를 찾기에도 더 수월해집니다.
// 일관성 있는 에러 처리:

// 모든 에러 조건을 한 번에 처리하고, 에러가 없는 경우에만 정상적인 로직이 실행되므로, 에러 처리 로직이 일관되게 적용됩니다. 이를 통해 실수를 방지할 수 있습니다.