// crRouter.js
const express = require('express');
const router = express.Router();
const comts = require('../model/comts');

// 댓글 좋아요/싫어요 기능 구현

// 좋아요 추가
router.post('/like', (req, res) => {
    const { comment_id, user_id } = req.body;

    if (!comment_id || !user_id) {
        return res.status(400).json({ error: '모든 필드를 입력해야합니다.' });
    }

    comts.checkReaction(comment_id, user_id, (err, result) => {
        if (err) return res.status(500).json({ error: '오류 발생' });

        if (result && result.like_status === 1) {
            return res.status(400).json({ message: '이미 좋아요를 눌렀습니다.' });
        }

        comts.likeComment(comment_id, user_id, (err, results) => {
            if (err) return res.status(500).json({ error: '좋아요 추가 실패' });
            res.status(201).json({ message: '좋아요가 추가되었습니다.', data: results });
        });
    });
});

// 싫어요 추가
router.post('/dislike', (req, res) => {
    const { comment_id, user_id } = req.body;

    if (!comment_id || !user_id) {
        return res.status(400).json({ error: '모든 필드를 입력해야합니다.' });
    }

    comts.checkReaction(comment_id, user_id, (err, result) => {
        if (err) return res.status(500).json({ error: '오류 발생' });

        if (result && result.dislike_status === 1) {
            return res.status(400).json({ message: '이미 싫어요를 눌렀습니다.' });
        }

        comts.dislikeComment(comment_id, user_id, (err, results) => {
            if (err) return res.status(500).json({ error: '싫어요 추가 실패' });
            res.status(201).json({ message: '싫어요가 추가되었습니다.', data: results });
        });
    });
});

// 좋아요 취소
router.post('/cancel-like', (req, res) => {
    const { comment_id, user_id } = req.body;

    comts.cancelLike(comment_id, user_id, (err, result) => {
        if (err) return res.status(500).json({ error: '좋아요 취소 실패' });
        res.status(200).json({ message: '좋아요가 취소되었습니다.' });
    });
});

// 싫어요 취소
router.post('/cancel-dislike', (req, res) => {
    const { comment_id, user_id } = req.body;

    comts.cancelDislike(comment_id, user_id, (err, result) => {
        if (err) return res.status(500).json({ error: '싫어요 취소 실패' });
        res.status(200).json({ message: '싫어요가 취소되었습니다.' });
    });
});

module.exports = router;
