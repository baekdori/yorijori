const express = require("express");
const router = express.Router();
const foods = require('../model/foods'); // foods 모델을 불러옴
// 게시글 수정
router.get('/',(req,res)=>{

    const { food_name, food_desc, food_video, food_recipe, food_mood, ingre_img } = req.body; // 프론트에서 입력한 데이터를 body에 담음

    // 삽입할 데이터 객체 생성 (food_idx는 AUTO_INCREMENT이므로 명시하지 않음)
    const newPost = {
        food_name,
        food_desc,
        food_video,
        food_recipe,
        food_mood,
        ingre_img
    };

    // 데이터베이스에 새 게시글 삽입
    foods.postmodify(newPost, (err, results) => {
        if (err) {
            // 데이터베이스 삽입 중 오류 발생 시 서버 오류 응답 반환
            console.error('에러 발생:', err);
            return res.status(500).json({ message: '데이터 삽입 중 오류가 발생했습니다.' });  // 오류 500번: 서버 오류
        } else {
            // 데이터 삽입 성공 시 성공 응답 반환
            return res.status(201).json({ message: '데이터가 성공적으로 삽입되었습니다.', data: results });  // 상태 201번: 생성됨
        }
    });
});
module.exports=router;