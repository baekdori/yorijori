const express = require('express');  // express 모듈을 불러옴
const router = express.Router();  // express의 Router 기능을 사용해 새로운 라우터 객체 생성
const conn = require("../model/db"); // 데이터베이스 연결

// 카테고리 데이터를 저장한 배열 (하드코딩된 예시 데이터)
const categories = [
    {id : 1, name : '닭'},  // 카테고리 1: 닭
    {id : 2, name : '돼지'},  // 카테고리 2: 돼지
    {id : 3, name : '소'},  // 카테고리 3: 소
    {id : 4, name : '오리'},  // 카테고리 4: 오리
];

// 클라이언트가 GET 요청을 '/category'로 보냈을 때, 카테고리 목록을 JSON 형태로 반환
router.get('/', (req, res) => {
    res.json(categories);  // 카테고리 배열을 JSON으로 응답
});

// 특정 카테고리에 해당하는 food_name을 가진 데이터 조회
router.get('/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId; // URL에서 카테고리 ID 추출
    const category = categories.find(c => c.id == categoryId); // 해당 카테고리 검색

    if(!category){ // 카테고리가 없는 경우
        return res.status(404).json({error : '카테고리를 찾을 수 없습니다.'});
    }

    // Foods 테이블에서 해당 카테고리에 맞는 food_name을 조회
    const sql = `SELECT * FROM Foods WHERE food_name LIKE ?`; // SQL 쿼리
    conn.query(sql, [`%${category.name}%`], (err, results) => { // 쿼리 실행
        if (err) { // 쿼리 오류 발생 시
            console.error('데이터 조회 중 오류 발생 : ', err);
            return res.status(500).json({error : '데이터 조회에 실패했습니다'});
        }
        res.json(results); // 결과를 JSON으로 응답
    });
});

module.exports = router;  // 다른 파일에서 이 라우터를 사용할 수 있도록 내보냄

// 연동 원리와 과정 설명
// CategoryPage.jsx:

// 이 컴포넌트는 사용자가 카테고리 목록을 확인할 수 있는 페이지입니다.
// useEffect 훅을 사용하여 컴포넌트가 처음 렌더링될 때 API에서 카테고리 데이터를 가져옵니다.
// 카테고리 항목을 클릭하면 handleCategoryClick 함수가 호출되어 해당 카테고리의 상세 페이지로 이동합니다.
// CategoryDetail.jsx:

// 사용자가 선택한 카테고리의 상세 정보를 보여주는 페이지입니다.
// useParams 훅을 사용하여 URL에서 카테고리 ID를 추출하고, 이를 사용해 해당 카테고리의 세부 정보를 API로부터 가져옵니다.
// category.js:

// Express.js를 사용하여 카테고리 데이터를 처리하는 라우터를 설정합니다.
// GET 요청에 따라 모든 카테고리 목록을 반환하거나, 특정 카테고리에 해당하는 음식을 조회하는 SQL 쿼리를 실행합니다.
// mainRouter.js:

// category.js에서 설정한 라우터를 메인 애플리케이션에 연결하여, '/category' 경로로 들어오는 요청을 처리하도록 설정합니다.