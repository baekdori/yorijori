// DB와 연결정보 관리하는 공간
const mysql = require("mysql2");

// DB 연결정보를 설정
const conn = mysql.createConnection({
    host : "project-db-stu3.smhrd.com",
    port : 3307,
    user : "Insa5_JSB_hacksim_1",
    password : "aischool1",
    datebase : "Insa5_JSB_hacksim_1"
});

// 연결 진행
conn.connect();
console.log("DB연결");

module.exports = conn;