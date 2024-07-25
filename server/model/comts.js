const conn = require("./db");
const comts = {

















// ^--여기사요
    // 2. 댓글 삭제
    comtsdelete: (comments_idx, callback) => {
        const sql = `DELETE FROM comts WHERE comments_idx = ?`;
        conn.query(sql, [comments_idx], callback);
    },

    // 3. 댓글 수정
    comtsmodify: (comments_idx, updatedComment, callback) => {
        const sql = `UPDATE comts SET comment_text = ?, comments_time = NOW() WHERE comments_idx = ?`;
        const { comment_text} = updatedComment;
        conn.query(sql, [comment_text, comments_idx], callback);
    },




















};
module.exports = comts;