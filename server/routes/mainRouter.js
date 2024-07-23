const express = require("express");
const app = express();
const session = require('./session');
const port = 4000;  // 4000포트 오픈
const cors = require("cors");

// CORS(Cross-Origin Resource Sharing) 설정
// npm i CORS 설치 필요
app.use(cors({
  origin: 'http://localhost:3000',   // 3000포트의 데이터를 4000포트로 보냄
}));

// 미들웨어 설정
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


// 회원가입 라우터 설정
 const joinRouter = require('./joinRouter'); 
 app.use('/user/join', joinRouter);   // /user/join 경로의 모든 요청은 joinRouter 라우터로 전달됨

// 로그인 라우터 설정
 const loginRouter = require('./loginRouter');
 app.use('/user/login', loginRouter);

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});