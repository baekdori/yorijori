const express = require("express");
const router = express.Router();
const comments = require("../model/comments");

// 댓글 삭제
router.delete('/:comments_idx', (req, res) => {
    const { comments_idx } = req.params;

    comments.commentsdelete(comments_idx, (err, results) => {
        if (err) {
            console.error('댓글 삭제 중 오류 발생:', err);
            return res.status(500).json({ message: '댓글 삭제 중 오류가 발생했습니다.' });
        } else {
            return res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.', data: results });
        }
    });
});

module.express=router;