const conn = require("./db"); // 데이터베이스 연결 모듈을 불러옴

// 게시글 관련 모델 설정
const foods = {
    // 1. 게시글 등록 API
    postcreat: (postcreat, callback) => {
        const sql = `INSERT INTO Foods(food_name, food_desc, food_video, food_recipe, food_mood, ingre_img, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const { food_name, food_desc, food_video, food_recipe, food_mood, ingre_img, user_id } = postcreat;

        conn.query(sql, [food_name, food_desc, food_video, food_recipe, food_mood, ingre_img, user_id], (err, results) => {
            if (err) {
                console.error('데이터 삽입 중 오류 발생:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },


     // 2. 게시글 보기 API
     postsee: (food_idx, callback) => {
        const sql = `SELECT * FROM Foods WHERE food_idx = ?`;
        conn.query(sql, [food_idx], (err, results) => {
            if (err) {
                console.error('데이터 검색 중 오류 발생:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    },
    
    // 3. 게시글 수정 API
    postmodify: (food_idx, user_id, updatedPost, callback) => {
        const sql = `
            UPDATE Foods
            SET food_name = ?, food_desc = ?, food_video = ?, food_recipe = ?, food_mood = ?, ingre_img = ?
            WHERE food_idx = ? AND user_id = ?
        `;
    const { food_name, food_desc, food_video, food_recipe, food_mood, ingre_img } = updatedPost;
    conn.query(sql, [food_name, food_desc, food_video, food_recipe, food_mood, ingre_img, food_idx, user_id], callback);
    },
    // 4. 게시글 삭제 API
    postdelete: (food_idx, user_id, callback) => {
        const sql = `DELETE FROM Foods WHERE food_idx = ? AND user_id = ?`;
        conn.query(sql, [food_idx, user_id], callback);
    },
    // 5. 키워드 검색 API
    searchFoodsByIngredients(ingredients, callback) {
        // 재료 목록을 하나의 문자열로 결합 (재료들을 ', '로 구분하여 하나의 문자열로 만듭니다)
        const combinedIngredients = ingredients.join(', ');
    
        // 쿼리문을 작성합니다. food_mood 컬럼이 combinedIngredients와 정확히 일치하는 행을 찾습니다.
        const query = `SELECT food_idx, food_name, food_video FROM Foods WHERE food_mood = ?`;
    
        // 쿼리 실행 시 사용할 값을 배열에 담습니다. 여기서는 combinedIngredients가 유일한 값입니다.
        const values = [combinedIngredients];
    
        // 데이터베이스에 쿼리를 실행하고, 결과를 콜백 함수로 반환합니다.
        conn.query(query, values, callback);
    }
    
    
};

module.exports = foods; // foods 객체를 외부에서 사용할 수 있도록 내보냄
