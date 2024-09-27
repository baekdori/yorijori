// favoriteList.js
const db = require('./db'); // 데이터베이스 연결

// 기본 콜백 함수
const defaultCallback = (err, result) => {
    if (err) console.error(err);
    else console.log(result);
};

// 특정 사용자의 즐겨찾기 목록 조회 함수
const getFavoriteByUser = (user_Id, callback = defaultCallback) => {
    const query = 'SELECT food_idx, food_name, created_at FROM Favorites WHERE user_id = ?';
    db.query(query, [user_Id], (err, results) => {
        if(err) return callback(err);
        callback(null, results);
    });
};
module.exports = {
    getFavoriteByUser
};
