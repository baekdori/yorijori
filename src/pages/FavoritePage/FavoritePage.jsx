import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FavoritePage.css';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';

const FavoritePage = () => {
    const [favorites, setFavorites] = useState([]);

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

    return (
        <div className='like_page_container'>
            <TopBar />
            <div className='like_page_title'>좋아요 목록</div>
            <div className='like_page_1st_line' />
            <div className='favorites-list'> {/* 발전 방향 : 매핑되는 리스트들에 각각의 음식 이미지 깔고 클릭하면 해당 음식 레시피 페이지로 이동 */}
                {favorites.map((favorite) => (
                    <div key={favorite.food_idx} className='favorite-item'>
                        <div>
                        <h3 className='fav-food-idx'>음식 번호: {favorite.food_idx}</h3>
                        <p className='fav-food-name'>음식 이름: {favorite.food_name}</p>
                        <span className='fav-food-date'>등록 일자: {new Date(favorite.created_at).toLocaleDateString()}</span>            
                        <img src = '/static/img/DakGalbi.jpg' className='favorite-img' />
                        
                        </div>
                    </div>
                    
                ))}
            </div>
            <BottomBar />
        </div>
    );
};

export default FavoritePage;
