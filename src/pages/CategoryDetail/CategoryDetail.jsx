import React, { useEffect, useState} from 'react'
import './CategoryDetail.css'
import { useParams } from 'react-router-dom'; // 카테고리 ID 추출을 위해 useParams 사용
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';

const CategoryDetail = () => {
    const { categoryId } = useParams(); // URL에서 카테고리 ID 추출
    const [categoryDetail, setCategoryDetail] = useState([]);

    useEffect(() => {
        const fetchCategoryDetail = async () => {
            try {
                const response = await fetch (`http://localhost:4000/category/${categoryId}`)
                if (!response.ok){
                    throw new Error('카테고리 세부 정보를 불러오는데 실패했습니다.')
                }
                const data = await response.json();
                setCategoryDetail(data);
            } catch(error){
                console.error(error.message);         
            }
        };
        fetchCategoryDetail();
    }, [categoryId]);

    return (
        <div className='ctg_detail_container'>
        <TopBar />
        <BottomBar />
        <div className='ctg_detail_title'>
            카테고리 상세
        </div>
        <div className='ctg_detail_1st_line'></div>
        <div className='ctg_detail_list'>
                {categoryDetail.length > 0 ? (
                    categoryDetail.map((item) => (
                        <div key={item.food_idx} className='ctg_detail_item'>
                            <div>
                            <img src={item.ingre_img} alt={item.food_name} className="ctg_detail_img" />
                            <h3 className='ctg_detail_name'>{item.food_name}</h3>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>카테고리 세부 정보를 불러오는 중입니다...</div>
                )}
            </div>
        </div>
        )
}

export default CategoryDetail