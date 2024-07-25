const express = require("express");
const router = express.Router();
const comts = require("../model/comts");

// 댓글 수정
router.put('/:comments_idx', (req, res) => {
    const { comments_idx } = req.params;
    const { comment_text, food_emotion } = req.body;
    const updatedComment = { comment_text, food_emotion };

    comts.comtsmodify(comments_idx, updatedComment, (err, results) => {
        if (err) {
            console.error('댓글 수정 중 오류 발생:', err);
            return res.status(500).json({ message: '댓글 수정 중 오류가 발생했습니다.' });
        } else {
            return res.status(200).json({ message: '댓글이 성공적으로 수정되었습니다.', data: results });
        }
    });
});

module.exports = router;
