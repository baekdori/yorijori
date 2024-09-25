import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FavoritePage.css';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';
import { useNavigate } from 'react-router-dom';

const FavoritePage = () => {
    const [favorites, setFavorites] = useState([]);
    const [foodData, setFoodData] = useState(null); // 음식 데이터를 저장할 상태
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const userId = sessionStorage.getItem('user'); // 세션에서 유저 ID를 가져옴
                const response = await axios.get('http://localhost:4000/favorites/list', {
                    params: { user_Id: userId }
                });
                setFavorites(response.data); // 가져온 즐겨찾기 데이터를 상태로 설정
            } catch (error) {
                console.error('즐겨찾기 불러오기에 오류 발생:', error);
            }
        };
        fetchFavorites(); // 컴포넌트가 마운트될 때 즐겨찾기 데이터를 가져옴
    }, []);

    // 즐겨찾기 아이템 클릭 핸들러
    const handleFavoriteClick = async (food_idx) => {
        try {
            // food_idx를 사용하여 Foods 테이블에서 데이터 조회
            const response = await axios.get('http://localhost:4000/foods/find', {
                params: { food_idx }
            });

            // 조회된 데이터를 상태로 저장
            if (response.data && response.data.length > 0) {
                setFoodData(response.data[0]); // 조회된 데이터 저장
                navigate(`/DetailPage/${foodData.food_idx}`, {state : { foodDetails : foodData}}); // DetailPage로 이동
            }
        } catch (error) {
            console.error('음식 데이터 조회 오류:', error);
            alert('음식 정보를 불러오는 데 오류가 발생했습니다.');
        }
    };

    return (
        <div className='like_page_container'>
            <TopBar />
            <div className='like_page_title'>좋아요 목록</div>
            <div className='like_page_1st_line' />
            <div className='favorites-list'>
                {favorites.map((favorite) => (
                    <div key={favorite.food_idx} className='favorite-item' onClick={() => handleFavoriteClick(favorite.food_idx)}>
                        <div>
                            <h3 className='fav-food-idx'>음식 번호: {favorite.food_idx}</h3>
                            <p className='fav-food-name'>음식 이름: {favorite.food_name}</p>
                            <span className='fav-food-date'>등록 일자: {new Date(favorite.created_at).toLocaleDateString()}</span>            
                            <img src='/static/img/DakGalbi.jpg' className='favorite-img' alt={favorite.food_name} />
                        </div>
                    </div>
                ))}
            </div>
            <BottomBar />
        </div>
    );
};

export default FavoritePage;
