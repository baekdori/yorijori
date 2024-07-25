const conn = require("./db"); // 데이터베이스 연결 모듈을 불러옴

// 게시글 관련 모델 설정
const foods = {
    // 1. 게시글 등록 API
    postcreat: (postcreat, callback) => {
        // SQL 쿼리 문자열: Foods 테이블에 새로운 행을 삽입
        // food_idx는 AUTO_INCREMENT 컬럼이므로 명시하지 않음
        const sql = `INSERT INTO Foods(food_name, food_desc, food_video, food_recipe, food_mood, ingre_img, foods_time)
                     VALUES (?, ?, ?, ?, ?, ?, NOW())`; // NOW() 함수는 현재 시간을 foods_time에 삽입

        // postcreat 객체에서 필요한 값을 구조 분해 할당하여 변수로 추출
        const { food_name, food_desc, food_video, food_recipe, food_mood, ingre_img } = postcreat;

        // 데이터베이스에 쿼리를 실행하여 값을 삽입
        // 두 번째 매개변수는 쿼리의 ?에 대체될 값들의 배열
        // 콜백 함수는 쿼리 실행 결과를 처리
        conn.query(sql, [food_name, food_desc, food_video, food_recipe, food_mood, ingre_img], callback);
    },

     // 2. 게시글 보기 API
    postsee: (food_idx, callback) => {
        // SQL 쿼리 문자열: Foods 테이블에서 특정 food_idx의 행을 선택
        const sql = `SELECT * FROM Foods WHERE food_idx = ?`;

        // 데이터베이스에 쿼리를 실행하여 값을 조회
        // 두 번째 매개변수는 쿼리의 ?에 대체될 값
        // 콜백 함수는 쿼리 실행 결과를 처리
        conn.query(sql, [food_idx], callback);
    },
    // 3. 게시글 수정 API
    postmodify:(food_idx,callback)=>{

    },
    // 4. 게시글 삭제 API
    postdelete:(food_idx,callback)=>{

    },

    findMatchingFoods: (ingredients, callback) => {
        if (ingredients.length === 0) {
            return callback(null, []);
        }

        // 각 재료를 '%재료%' 형태로 변환하여 LIKE 쿼리에 포함
        const conditions = ingredients.map(() => 'food_mood LIKE ?').join(' AND ');
        const values = ingredients.map(ingredient => `%${ingredient}%`);
        const query = `SELECT food_idx, food_name FROM Foods WHERE ${conditions}`;

        conn.query(query, values, callback);
    }
    
};

module.exports = foods; // foods 객체를 외부에서 사용할 수 있도록 내보냄
