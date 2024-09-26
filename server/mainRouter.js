// mainRouter.js
const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path'); 
const cors = require("cors");
const fs = require('fs');
// const session = require('./session');
const { sessionMiddleware, cookieParser } = require('./session');
const port = 4000;  // 4000포트 오픈
const favorite = require('./model/favorite')
const app = express();


// 미들웨어 설정
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cookieParser);
app.use(sessionMiddleware);


// CORS(Cross-Origin Resource Sharing) 설정
app.use(cors({
  origin: 'http://localhost:3000',   // 3000포트의 데이터를 4000포트로 보냄
  credentials: true // 세션 정보가 포함된 요청을 허용
}));

// app.use(session);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// 회원가입 라우터(하은)
const SignupRouter = require('./routes/SignupRouter');
app.use('/user/signup', SignupRouter);  // SignupRouter와 signup 화면 연결
console.log('회원가입 라우터 연결됨: /user/signup');

// 로그인 라우터(하은)
const LoginRouter = require('./routes/LoginRouter'); 
app.use('/user/login', LoginRouter);   // LoginRouter와 login 화면 연결
console.log('로그인 라우터 연결됨: /user/login');

// 로그아웃 라우터(하은)
const LogoutRouter = require('./routes/LogoutRouter'); 
app.use('/user/logout', LogoutRouter);   // LogoutRouter와 logout 버튼 연결
console.log('로그아웃 라우터 연결됨: /user/logout');

// 마이페이지 (프로필, 회원정보 수정 및 탈퇴) 라우터 (하은)
const MypageRouter = require('./routes/MypageRouter'); 
app.use('/user/mypage', MypageRouter);   // MypageRouter와 mypage 화면 연결
console.log('마이페이지 라우터 연결됨: /user/mypage');

// 검색 라우터(지훈)
const searchFoodsByIngredient = require('./routes/searchFoodsByIngredient');
app.use('/foods/search', searchFoodsByIngredient);

// 게시글 작성 라우터(우석) -> RecipeAddPage
const pcRouter = require('./routes/pcRouter')
app.use('/foods/postcreat',pcRouter);
console.log('게시글 작성 라우터 연결: /foods/postcreat')

// 게시글 보기 라우터(우석)
const psRouter = require('./routes/psRouter')
app.use('/foods/postsee',psRouter);
console.log('게시글 보기 라우터 연결: /foods/postsee')

// 게시글 수정 라우터(우석)
const pmRouter = require('./routes/pmRouter')
app.use('/foods/postmodify',pmRouter);
console.log('게시글 수정 라우터 연결: /foods/postmodify')

// 게시글 삭제 라우터(우석)
const pdRouter = require('./routes/pdRouter')
app.use('/foods/postdelete',pdRouter);
console.log('게시글 삭제 라우터 연결: /foods/postdelete')

// 댓글 보기 라우터(우석)
const csRouter = require('./routes/csRouter')
app.use('/comts/comtssee',csRouter);
console.log('게시글 보기 라우터 연결: /comts/comtssee')

// 댓글 생성 라우터(훈민)
const ccRouter = require('./routes/ccRouter');
app.use('/comts/comtscreate', ccRouter);
console.log('댓글 생성 라우터 연결 : /comts/comtscreate');

// 댓글 삭제 라우터(우석)
const cdRouter = require('./routes/cdRouter')
app.use('/comts/comtsdelete',cdRouter);
console.log('댓글 삭제 라우터 연결: /comts/comtsdelete')

// 댓글 수정 라우터(우석)
const cmRouter = require('./routes/cmRouter')
app.use('/comts/comtsmodify',cmRouter);
console.log('댓글 수정 라우터 연결: /comts/comtsmodify')

// 추천 라우터(지훈)
const recommendRouter = require('./routes/recommend'); 
app.use('/random-food-idx', recommendRouter);

// 즐겨찾기 라우터(지훈)
const favoriteRouter = require('./routes/favoriteList');
app.use('/favorites', favoriteRouter);
console.log('즐겨찾기 라우터 연결 : /favorite');

// 카테고리 라우터(종호)
const categoryRouter = require('./routes/category');  // category.js 파일에서 정의한 카테고리 라우터를 불러옴
app.use('/category', categoryRouter);  // '/category' 경로로 들어오는 요청을 categoryRouter로 처리
console.log('카테고리 라우터 연결 : /routes/category');  // 콘솔에 라우터가 연결되었다고 출력

// 저장된 레시피 idx로 바로 레시피 조회 라우터
const findByFoodIdx = require('./routes/findByFoodIdx')
app.use('/findByFoodIdx', findByFoodIdx);
console.log('저장된 레시피 idx로 바로 레시피 조회 라우터 연결 : /findByFoodIdx');

app.use(express.json()); // JSON 요청을 파싱

// 북마크 토글 API(종호)
app.post('/api/favorites/toggle', (req, res) => {
    const { userId, foodIdx } = req.body;

    if (!userId || !foodIdx) {
        return res.status(400).send('Missing userId or foodIdx');
    }

    // 현재 북마크 여부 확인
    favorite.checkFavorite(userId, foodIdx, (err, isFavorited) => {
        if (err) {
            console.error('북마크 확인 오류:', err);
            return res.status(500).send('Server Error');
        }

        if (isFavorited) {
            // 이미 북마크된 상태이면 북마크 해제
            favorite.removeFavorite(userId, foodIdx, (err, result) => {
                if (err) {
                    console.error('북마크 해제 오류:', err);
                    return res.status(500).send('Server Error');
                }
                res.send('Favorite removed');
            });
        } else {
            // 북마크 추가
            favorite.addFavorite(userId, foodIdx, (err, result) => {
                if (err) {
                    console.error('북마크 추가 오류:', err);
                    return res.status(500).send('Server Error');
                }
                res.send('Favorite added');
            });
        }
    });
});


// 서버 시작(종호)
app.listen(port, () => {
  console.log(`백앤드 서버 시작 포트: http://localhost:${port}`);// 실행하는 포트를 확인시켜줌
});

// 레시피 작성 페이지의 로그인 확인(종호)
const SessionCheckRouter = require('./routes/SessionCheckRouter');
app.use('/user', SessionCheckRouter);