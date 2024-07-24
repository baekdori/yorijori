const express = require("express");
const path = require('path'); 
const session = require('./session');
const port = 4000;  // 4000포트 오픈
const cors = require("cors");

const app = express();

// CORS(Cross-Origin Resource Sharing) 설정
// npm i CORS 설치 필요
app.use(cors({
  origin: 'http://localhost:3000',   // 3000포트의 데이터를 4000포트로 보냄
}));

// 미들웨어 설정
app.use(express.urlencoded({ extended: false }));  // 바디파서 설정하고싶은데 이거 true로 바꿔도 될까요?(하은)
app.use(express.json());
app.use(session);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, '../build')));

// 모든 경로에 대해 index.html 제공
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// 회원가입 라우터
const SignupRouter = require('./routes/SignupRouter');
app.use('/user/signup', SignupRouter);  // signup이라는 db에 router 연결

// 로그인 라우터
const LoginRouter = require('./routes/LoginRouter'); 
app.use('/user/login', LoginRouter);   // login이라는 db에 router 연결

// 검색  라우터
const searchFoodsByIngredient = require('./routes/searchFoodsByIngredient');
app.use('/ingredients/searchFoodsByIngredient', searchFoodsByIngredient);

// 게시글 작성 라우터
const pcRouter = require('./routes/pcRouter')
app.use('/foods/postcreat',pcRouter);

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});