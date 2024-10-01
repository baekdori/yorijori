// mainRouter.js
const express = require("express");  // Express 모듈을 가져와서 웹 서버를 구축하는 데 사용
const router = express.Router();  // Express의 Router 기능을 이용하여 라우터 객체 생성
const bodyParser = require('body-parser');  // HTTP 요청 본문을 파싱하는 body-parser 모듈을 가져옴
const path = require('path');  // 파일 경로를 다루기 위한 path 모듈
const cors = require("cors");  // CORS(Cross-Origin Resource Sharing)를 허용하기 위한 모듈
const fs = require('fs');  // 파일 시스템 접근을 위한 fs 모듈
const cookieParser = require('cookie-parser');  // 쿠키 파싱을 위한 모듈
const { sessionMiddleware } = require('./session');  // 세션 미들웨어를 불러옴
const port = 4000;  // 백엔드 서버가 동작할 포트 번호를 4000으로 설정
const app = express();  // Express 애플리케이션 생성

// 미들웨어 설정
app.use(cookieParser());  // 쿠키를 파싱하는 미들웨어 추가
app.use(sessionMiddleware);  // 세션 미들웨어 추가
app.use(express.urlencoded({ extended: true }));  // URL-encoded 데이터를 파싱하는 미들웨어
app.use(express.json());  // JSON 형식의 HTTP 요청 본문을 파싱하는 미들웨어

// CORS(Cross-Origin Resource Sharing) 설정
app.use(cors({
  origin: 'http://localhost:3000',  // CORS를 허용할 프론트엔드 도메인 설정
  credentials: true,  // 인증 정보를 포함한 요청 허용
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // 허용할 HTTP 메서드 설정
  allowedHeaders: ['Content-Type', 'Authorization'],  // 허용할 헤더 설정
}));

// 프리플라이트 요청 처리
app.options('*', cors());  // 모든 경로에서 프리플라이트 요청 처리 허용

// bodyParser 미들웨어
app.use(bodyParser.json());  // JSON 요청을 파싱하는 bodyParser 미들웨어 사용
app.use(bodyParser.urlencoded({ extended: true }));  // URL-encoded 요청을 파싱하는 bodyParser 미들웨어 사용

// 회원가입, 로그인, 로그아웃, 마이페이지 라우터 설정
// 회원가입 라우터(하은)
const SignupRouter = require('./routes/SignupRouter');
app.use('/user/signup', SignupRouter);  // '/user/signup' 경로에서 회원가입 처리
console.log('회원가입 라우터 연결됨: /user/signup');

// 로그인 라우터(하은)
const LoginRouter = require('./routes/LoginRouter'); 
app.use('/user/login', LoginRouter);  // '/user/login' 경로에서 로그인 처리
console.log('로그인 라우터 연결됨: /user/login');

// 로그아웃 라우터(하은)
const LogoutRouter = require('./routes/LogoutRouter'); 
app.use('/user/logout', LogoutRouter);  // '/user/logout' 경로에서 로그아웃 처리
console.log('로그아웃 라우터 연결됨: /user/logout');

// 마이페이지 (프로필, 회원정보 수정 및 탈퇴) 라우터 (하은)
const MypageRouter = require('./routes/MypageRouter'); 
app.use('/user/mypage', MypageRouter);  // '/user/mypage' 경로에서 마이페이지 기능 처리
console.log('마이페이지 라우터 연결됨: /user/mypage');

// 기능 라우터 설정
// 검색 라우터(지훈)
const searchFoodsByIngredient = require('./routes/searchFoodsByIngredient');
app.use('/foods/search', searchFoodsByIngredient);  // '/foods/search' 경로에서 음식 검색 처리

// 게시글 작성 라우터(우석)
const pcRouter = require('./routes/pcRouter');
app.use('/foods/postcreat', pcRouter);  // '/foods/postcreat' 경로에서 게시글 작성 처리
console.log('게시글 작성 라우터 연결: /foods/postcreat');

// 게시글 보기 라우터(우석)
const psRouter = require('./routes/psRouter');
app.use('/foods/postsee', psRouter);  // '/foods/postsee' 경로에서 게시글 조회 처리
console.log('게시글 보기 라우터 연결: /foods/postsee');

// 게시글 수정 라우터(우석)
const pmRouter = require('./routes/pmRouter');
app.use('/foods/postmodify', pmRouter);  // '/foods/postmodify' 경로에서 게시글 수정 처리
console.log('게시글 수정 라우터 연결: /foods/postmodify');

// 게시글 삭제 라우터(우석)
const pdRouter = require('./routes/pdRouter');
app.use('/foods/postdelete', pdRouter);  // '/foods/postdelete' 경로에서 게시글 삭제 처리
console.log('게시글 삭제 라우터 연결: /foods/postdelete');

// 댓글 보기 라우터(우석)
const csRouter = require('./routes/csRouter');
app.use('/comts/comtssee', csRouter);  // '/comts/comtssee' 경로에서 댓글 보기 처리
console.log('댓글 보기 라우터 연결: /comts/comtssee');

// 댓글 생성 라우터(훈민)
const ccRouter = require('./routes/ccRouter');
app.use('/comts/comtscreate', ccRouter);  // '/comts/comtscreate' 경로에서 댓글 작성 처리
console.log('댓글 생성 라우터 연결: /comts/comtscreate');

// 댓글 삭제 라우터(우석)
const cdRouter = require('./routes/cdRouter');
app.use('/comts/comtsdelete', cdRouter);  // '/comts/comtsdelete' 경로에서 댓글 삭제 처리
console.log('댓글 삭제 라우터 연결: /comts/comtsdelete');

// 댓글 수정 라우터(우석)
const cmRouter = require('./routes/cmRouter');
app.use('/comts/comtsmodify', cmRouter);  // '/comts/comtsmodify' 경로에서 댓글 수정 처리
console.log('댓글 수정 라우터 연결: /comts/comtsmodify');

// 댓글 좋아요/싫어요 라우터 (종호)
const crRouter = require('./routes/crRouter');
app.use('/reactions', crRouter);  // '/reactions' 경로에서 댓글 좋아요/싫어요 처리
console.log('댓글 좋아요/싫어요 라우터 연결: /reactions');

// 추천 라우터(지훈)
const recommendRouter = require('./routes/recommend'); 
app.use('/random-food-idx', recommendRouter);  // '/random-food-idx' 경로에서 음식 추천 처리

// 즐겨찾기 라우터(종호)
const favoriteListRouter = require('./routes/favoriteListRouter');
app.use('/favorites', favoriteListRouter);  // '/favorites' 경로에서 즐겨찾기 처리
console.log('즐겨찾기 라우터 연결 : /favorites');

// 카테고리 라우터(종호)
const categoryRouter = require('./routes/categoryRouter');
app.use('/category', categoryRouter);  // '/category' 경로에서 카테고리 관련 요청 처리
console.log('카테고리 라우터 연결 : /category');

// 북마크 라우터(종호)
const bookmarkRouter = require('./routes/bookmarkRouter');
app.use('/bookmarks', bookmarkRouter);  // '/bookmarks' 경로에서 북마크 관련 요청 처리
console.log('북마크 라우터 연결 : /bookmarks');

// 저장된 레시피 idx로 바로 레시피 조회 라우터(종호)
const findByFoodIdx = require('./routes/findByFoodIdx');
app.use('/findByFoodIdx', findByFoodIdx);  // '/findByFoodIdx' 경로에서 레시피 조회 처리
console.log('저장된 레시피 idx로 바로 레시피 조회 라우터 연결 : /findByFoodIdx');

// 레시피 작성 페이지의 로그인 확인(종호)
const SessionCheckRouter = require('./routes/SessionCheckRouter');
app.use('/user', SessionCheckRouter);  // '/user' 경로에서 세션 체크 처리

// 서버 시작 포트 안내(종호)
app.listen(port, () => {
    console.log(`백앤드 서버 시작 포트: http://localhost:${port}`);  // 4000번 포트에서 서버 시작 로그 출력
});
