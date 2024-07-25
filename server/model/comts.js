const conn = require("./db");

const comts = {
    // 1. 댓글 삭제
    comtsdelete: (comments_idx, callback) => {
        const sql = `DELETE FROM comts WHERE comments_idx = ?`;
        conn.query(sql, [comments_idx], callback);
    },

    // 2. 댓글 수정
    comtsmodify: (comments_idx, updatedComment, callback) => {
        const sql = `UPDATE comts SET comment_text = ?, comments_time = NOW() WHERE comments_idx = ?`;
        const { comment_text } = updatedComment;
        conn.query(sql, [comment_text, comments_idx], callback);
    },
    // 3. 특정 유저의 food_emotion = 1이 5개 이상인 경우 food_idx 조회
    getUserFoodIdx: (userId, callback) => {
        const sql = `
            SELECT food_idx
            FROM comts
            WHERE user_id = ? AND food_emotion = 1
            GROUP BY food_idx
            HAVING COUNT(*) >= 5
        `;
        conn.query(sql, [userId], callback);
    },

    // 4. 모든 사용자 기준으로 food_emotion = 1인 food_idx 조회
    getAllFoodIdx: (callback) => {
        const sql = `
            SELECT food_idx
            FROM comts
            WHERE food_emotion = 1
            GROUP BY food_idx
        `;
        conn.query(sql, callback);
    },

    // 5. 특정 유저의 food_emotion = 1이 5개 이상인지 확인하고, 랜덤으로 food_idx 반환
    getRandomFoodIdx: (userId, callback) => {
        // Step 1: 사용자의 food_emotion = 1이 5개 이상인지 확인
        comts.getUserFoodIdx(userId, (err, rows) => {
            if (err) return callback(err);

            if (rows.length >= 5) {
                // 사용자 기준으로 food_emotion = 1이 5개 이상인 경우
                const randomIndex = Math.floor(Math.random() * rows.length);
                const randomFoodIdx = rows[randomIndex].food_idx;
                return callback(null, { food_idx: randomFoodIdx });
            } else {
                // 모든 사용자 기준으로 food_emotion = 1인 food_idx 조회
                comts.getAllFoodIdx((err, rows) => {
                    if (err) return callback(err);

                    if (rows.length > 0) {
                        const randomIndex = Math.floor(Math.random() * rows.length);
                        const randomFoodIdx = rows[randomIndex].food_idx;
                        return callback(null, { food_idx: randomFoodIdx });
                    } else {
                        return callback(null, { message: '해당하는 food_idx가 없습니다.' });
                    }
                });
            }
        });
    }

};

module.exports = comts;
