// 초기 설정
const express = require("express")// 익스프레스 사용할거야!
const session = require("express-session")
const routes = express.Router()

//세션 설정하기
routes.get("/setSession",(req,res)=>{
    req.session.name = "kws";
    res.redirect("/")
})
module.exports=routes;