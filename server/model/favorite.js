const db = require('./db'); // 데이터베이스 연결

// 북마크 여부 확인 함수
const checkFavorite = (user_Id, food_Idx, callback) => {
    const query = 'SELECT * FROM Favorites WHERE user_id = ? AND food_idx = ?';
    db.query(query, [user_Id, food_Idx], (err, results) => {
        if (err) return callback(err);
        callback(null, results.length > 0); // 이미 북마크된 상태인지 확인
    });
};

// 북마크 추가 함수
const addFavorite = (user_Id, food_Idx, callback) => {
    const query = 'INSERT INTO Favorites (user_id, food_idx, created_at) VALUES (?, ?, NOW())';
    db.query(query, [user_Id, food_Idx], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// 북마크 해제 함수
const removeFavorite = (user_Id, food_Idx, callback) => {
    const query = 'DELETE FROM Favorites WHERE user_id = ? AND food_idx = ?';
    db.query(query, [user_Id, food_Idx], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

module.exports = {
    checkFavorite,
    addFavorite,
    removeFavorite
};