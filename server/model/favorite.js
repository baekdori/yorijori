const conn = require("./db");

const favorite = {
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
    
    removeFavorite: (userId, foodIdx, callback) => {
        const sql = `
            DELETE FROM Favorites
            WHERE user_id = ? AND food_idx = ?
        `;
        conn.query(sql, [userId, foodIdx], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    checkFavorite: (userId, foodIdx, callback) => {
        const sql = `
            SELECT COUNT(*) as count
            FROM Favorites
            WHERE user_id = ? AND food_idx = ?
        `;
        conn.query(sql, [userId, foodIdx], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0].count > 0);
        });
    },

    getFavorites: (userId, callback) => {
        const sql = `
            SELECT f.food_idx, r.food_name, r.food_desc
            FROM Favorites f
            JOIN Recipes r ON f.food_idx = r.food_idx
            WHERE f.user_id = ?
        `;
        conn.query(sql, [userId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    
};

module.exports = favorite;
