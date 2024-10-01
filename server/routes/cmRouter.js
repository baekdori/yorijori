// cmRouter.js
const express = require("express");
const router = express.Router();
const comts = require("../model/comts");

// 댓글 수정 라우터 (PUT 요청)
router.put('/', (req, res) => {
    const { comments_idx, user_id } = req.query;
    const { comment_text, food_emotion } = req.body;

    // 필수 데이터가 없는 경우 바로 반환
    if (!comments_idx || !user_id) {
        return res.status(400).json({ error: 'comments_idx와 user_id는 필수입니다.' });
    }

    const updatedComment = { comment_text, food_emotion };

    // 댓글 수정
    comts.comtsmodify(comments_idx, user_id, updatedComment, (err, results) => {
        if (err) {
            console.error('댓글 수정 중 오류 발생:', err);
            return res.status(500).json({ message: '댓글 수정 중 오류가 발생했습니다.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: '수정할 댓글을 찾을 수 없거나 권한이 없습니다.' });
        }

        return res.status(200).json({ message: '댓글이 성공적으로 수정되었습니다.', data: results });
    });
});

module.exports = router;
