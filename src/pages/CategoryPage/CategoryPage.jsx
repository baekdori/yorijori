import React, { useEffect, useState } from 'react';  // React와 훅(hook) 불러오기
import './CategoryPage.css';  // 스타일링 파일 불러오기
import TopBar from '../../components/TopBar/TopBar';  // 상단 바 컴포넌트
import BottomBar from '../../components/BottomBar/BottomBar';  // 하단 바 컴포넌트

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);  // 카테고리 데이터를 저장할 상태 변수

    // 카테고리 목록을 API에서 가져오는 함수 (비동기 함수)
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:4000/category');  // 백엔드 서버로 GET 요청
            if (!response.ok) {  // 응답이 정상적이지 않을 경우 에러 처리
                throw new Error('카테고리 목록을 불러오는데 실패했습니다.');
            }
            const data = await response.json();  // 응답 데이터를 JSON으로 파싱
            setCategories(data);  // 파싱된 데이터를 상태 변수에 저장
        } catch (error) {
            console.error(error.message);  // 에러 발생 시 콘솔에 출력
        }
    };

    // 컴포넌트가 처음 렌더링될 때 한 번만 실행 (빈 배열이 전달되므로 useEffect가 한 번만 호출됨)
    useEffect(() => {
        fetchCategories();  // 카테고리 데이터를 불러오는 함수를 호출
    }, []);
    
    return (
        <div className='ctg_page_container'>
            <TopBar />  {/* 상단 바 렌더링 */}
            <BottomBar />  {/* 하단 바 렌더링 */}
            <div className='ctg_page_title'>카테고리</div>  {/* 페이지 제목 */}
            <div className='ctg_page_1st_line'></div>  {/* 디자인적 요소 (예: 구분선) */}
            
            <div className='ctg_list'>
                {categories.length > 0 ? (  // 카테고리 데이터가 있을 경우에만 렌더링
                    categories.map((category) => (
                        <div key={category.id} className='ctg_item'>
                            {category.name}  {/* 카테고리 이름 출력 */}
                        </div>
                    ))
            ) : (
                <div>카테고리를 불러오는 중입니다.</div>
            )}
        </div>
        </div>
        )
}

export default CategoryPage  // 컴포넌트 내보내기