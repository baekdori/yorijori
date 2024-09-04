import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './FavoritePage.css';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';

const FavoritePage = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            try{
                const response = await axios.get('http://localhost:4000/favorites',{
                    params : {user_id : sessionStorage.getItem('user')} // 유저 아이디를 세션에서 가져옴
                });
                setFavorites(response.data); // 가져온 즐겨찾기 데이터를 상태로 설정 
            }catch(error){
                console.error('즐겨찾기 불러오기에 오류 발생 : ', error)
            }
        };
        fetchFavorites(); // 컴포넌트가 마운트될 때 즐겨찾기 데이터를 가져옴
    }, [])

    return (
    <div className='like_page_container'>
    <TopBar />

    <div className='like_page_title'>
        좋아요 목록
    </div>
    <div className='like_page_1st_line'></div>
    <div className='favorites-list'>
        {favorites.map((favorites) =>(
            <div key={favorites.food_idx} className='favorite-item'>
                <h3>{favorites.food_name}</h3>
                <p>{favorites.food_desc}</p>
            </div>
        ))}
    </div>
    <BottomBar />
    </div>
    )
};

export default FavoritePage;