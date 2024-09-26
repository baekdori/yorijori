// CategoryDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CategoryDetail.css';
import { useNavigate, useParams } from 'react-router-dom';

const CategoryDetail = (setCateTodetailResult) => {
    const { categoryId } = useParams(); // URL에서 카테고리 ID 추출
    const [categoryDetail, setCategoryDetail] = useState([]);
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate
    const [selectedFoodIdx, setSelectedFoodIdx] = useState(null); // 초기값 수정
    const [foodData, setFoodData] = useState(null); // DB에서 조회한 음식 데이터 상태

    useEffect(() => {
        const fetchCategoryDetail = async () => {
            try {
                const response = await fetch(`http://localhost:4000/category/${categoryId}`);
                if (!response.ok) {
                    throw new Error('카테고리 세부 정보를 불러오는데 실패했습니다.');
                }
                const data = await response.json();
                setCategoryDetail(data);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchCategoryDetail();
    }, [categoryId]);

    const handleDetailClick = async (food_idx) => {
        try {
            // food_idx를 사용하여 Foods 테이블에서 데이터 조회
            const fIdx = food_idx;
            const response = await axios.get('http://localhost:4000/foods/search', {
                params: { q : fIdx }
            });

            // 조회된 데이터를 상태로 저장
            if (response.data && response.data.length > 0) {
                setCateTodetailResult(response.data[0]); // 조회된 데이터 저장
                navigate(`/DetailPage/${food_idx}`, { state: { foodDetails: response.data[0] } }); // DetailPage로 이동
            }
        } catch (error) {
            console.error('음식 데이터 조회 오류:', error);
            alert('음식 정보를 불러오는 데 오류가 발생했습니다.');
        }
    };

    return (
        <div className='ctg_detail_container'>
            <div className='ctg_detail_title'>카테고리 상세</div>
            <div className='ctg_detail_list'>
                {categoryDetail.length > 0 ? (
                    categoryDetail.map((item) => (
                        <div key={item.food_idx} className='ctg_detail_item' onClick={() => handleDetailClick(item.food_idx)}>
                            <img src={item.ingre_img} alt={item.food_name} className="ctg_detail_img" />
                            <h3 className='ctg_detail_name'>{item.food_name}</h3>
                        </div>
                    ))
                ) : (
                    <div>카테고리 세부 정보를 불러오는 중입니다...</div>
                )}
            </div>
        </div>
    );
};

export default CategoryDetail;
