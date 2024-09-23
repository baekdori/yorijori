const express = require('express');  // express 모듈을 불러옴
const router = express.Router();  // express의 Router 기능을 사용해 새로운 라우터 객체 생성

// 카테고리 데이터를 저장한 배열 (하드코딩된 예시 데이터)
const categories = [
    {id : 1, name : '한식'},  // 카테고리 1: 한식
    {id : 2, name : '양식'},  // 카테고리 2: 양식
    {id : 3, name : '중식'},  // 카테고리 3: 중식
    {id : 4, name : '일식'},  // 카테고리 4: 일식
];

// 클라이언트가 GET 요청을 '/category'로 보냈을 때, 카테고리 목록을 JSON 형태로 반환
router.get('/', (req, res) => {
    res.json(categories)  // 카테고리 배열을 JSON으로 응답
})

module.exports = router;  // 다른 파일에서 이 라우터를 사용할 수 있도록 내보냄

// 이 코드는 Express.js 서버에서 카테고리 데이터를 제공하는 API입니다. 클라이언트가 /category 경로로 GET 요청을 보내면, 하드코딩된 카테고리 데이터를 JSON 형식으로 응답합니다.

// 페이지가 출력되는 과정 (연동 과정 설명)
// 백엔드 서버 설정 (mainRouter.js):

// 서버는 http://localhost:4000에서 실행되며, /category 경로로 들어오는 모든 요청은 routes/category.js 파일에서 처리됩니다. 여기서 하드코딩된 카테고리 데이터를 JSON으로 응답합니다.
// 프론트엔드 요청 (CategoryPage.jsx):

// CategoryPage.jsx는 useEffect를 사용하여 페이지가 처음 로드될 때 자동으로 fetchCategories 함수를 호출하여 http://localhost:4000/category로 GET 요청을 보냅니다.
// 카테고리 데이터 수신:

// 백엔드에서 응답한 카테고리 데이터가 fetch 함수에 의해 받아지고, response.json()을 통해 JSON 형식으로 파싱됩니다.
// 데이터 화면 출력:

// 파싱된 카테고리 데이터를 setCategories 함수로 상태 변수 categories에 저장하고, categories 배열을 순회하며 각 카테고리 이름을 화면에 출력합니다.