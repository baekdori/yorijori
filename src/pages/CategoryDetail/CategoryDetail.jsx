import React from 'react'
import './CategoryPage.css'
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';

const CategoryPage = () => {
    return (
        <div className='ctg_detail_container'>
        <TopBar />
        <BottomBar />
        <div className='ctg_detail_title'>
            카테고리 상세
        </div>
        <div className='ctg_detail_1st_line'></div>
        </div>
        )
}

export default CategoryPage