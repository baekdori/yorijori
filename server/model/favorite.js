const conn = require("./db");


const favorite = {
    // 즐겨찾기 항목 추가 또는 업데이트
     addFavorite: (userId, foodIdx, callback) => {
         const sql = `
            INSERT INTO Favorites (food_idx, created_at, user_id)
            VALUES (?, NOW(), ?)
            ON DUPLICATE KEY UPDATE created_at = NOW();
            `;
        conn.query(sql, [foodIdx, userId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    
    // 즐겨찾기 항목 삭제
     removeFavorite: (userId, foodIdx, callback) => {
         const sql = `
            DELETE FROM Favorites
            WHERE user_id = ? AND food_idx = ?
            `;
        conn.query(sql, [userId, foodIdx], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};
    
module.exports = favorite;