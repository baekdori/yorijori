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
                const response = await axios.get('http://localhost:4000/favorites', {
                    params: { userId }
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

            <div className='like_page_title'>
                좋아요 목록
            </div>
            <div className='like_page_1st_line'></div>
            <div className='favorites-list'>
                {favorites.map((favorite) => (
                    <div key={favorite.food_idx} className='favorite-item'>
                        <h3>{favorite.food_name}</h3>
                        <p>{favorite.food_desc}</p>
                    </div>
                ))}
            </div>
            
            <BottomBar />
        </div>
    );
};

export default FavoritePage;
