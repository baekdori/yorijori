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
    resave: false,
    saveUninitialized: false, // 초기화되지 않은 세션을 저장 안 함
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,  // 24시간 유지 (또는 원하는 시간으로 설정)
      secure: false // 개발 환경에서는 secure 설정 해제
    },
    store: new FileStore(fileStoreOptions)
  })
};

console.log('세션 미들웨어 설정 완료');
console.log('세션 저장소 : FileStore');
console.log('세션 만료 시간 : 4시간');
console.log('쿠키 파서 설정 완료');