const session = require('express-session');

module.exports = session({
  secret: 'Hexacore6!!', // 세션을 암호화하는 데 사용할 키
  resave: false,             // 세션을 강제로 저장할지 여부
  saveUninitialized: false,   // 초기화되지 않은 세션을 저장소에 저장할지 여부
  cookie: { 
    maxAge: 1000 * 60 * 60 // 세션의 유효기간 설정 (로그인 유지시간 1시간)
  }
});
