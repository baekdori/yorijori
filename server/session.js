// session.js
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path');

const fileStoreOptions = {
  path: path.join(__dirname, 'sessions'), // 세션 파일을 저장할 디렉토리 경로!!!!!!!!
  ttl: 14400 // 세션 파일의 유효기간 (초 단위로 설정, 여기서는 1시간)
};

module.exports = {
  sessionMiddleware: session({
    secret: 'Hexacore6!!',
    resave: false,             // 세션을 강제로 저장할지 여부
    saveUninitialized: false,   // 초기화되지 않은 세션을 저장소에 저장할지 여부
    rolling : true, // 요청이 발생하면 세션 쿠키 만료 시간을 갱신
    cookie : {
    maxAge : null, // 세션 쿠기가 브라우저 창이 닫히면 만료
    secure: false,        // 개발 환경에서는 false로 설정 (HTTPS가 아니기 때문에)
    httpOnly: true        // 클라이언트 자바스크립트에서 쿠키 접근 불가
  },
    store: new FileStore(fileStoreOptions)
  })
};

console.log('세션 미들웨어 설정 완료');
console.log('세션 저장소 : FileStore');
console.log('세션 만료 시간 : 4시간');
console.log('쿠키 파서 설정 완료');