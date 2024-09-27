// bookmark.js
const db = require('./db'); // 데이터베이스 연결

// 기본 콜백 함수
const defaultCallback = (err, result) => {
    if (err) console.error(err);
    else console.log(result);
};

// 북마크 여부 확인 함수
const checkBookmark = (user_Id, food_Idx, callback = defaultCallback) => {
    const query = 'SELECT * FROM Favorites WHERE user_id = ? AND food_idx = ?';
    db.query(query, [user_Id, food_Idx], (err, results) => {
        if (err) return callback(err);
        callback(null, results.length > 0);
    });
};

// 북마크 추가 함수
const addBookmark = (user_Id, food_Idx, foodName, callback = defaultCallback) => {
    const query = 'INSERT INTO Favorites (user_id, AND food_idx, food_name, created_at) VALUES (?, ?, ?, NOW())';
    db.query(query, [user_Id, food_Idx, foodName], (err, results) => {
        if (err) {
            return callback(err);
        }
        return callback(null, results);
    });
};

// 북마크 해제 함수
const removeBookmark = (user_Id, food_Idx, callback = defaultCallback) => {
    const query = 'DELETE FROM Favorites WHERE user_id = ? AND food_idx = ?';
    db.query(query, [user_Id, food_Idx], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

module.exports = {
    checkBookmark,
    addBookmark,
    removeBookmark
};