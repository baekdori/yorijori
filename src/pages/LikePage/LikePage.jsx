import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './LikePage.css';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';

const Like = () => {


    return (
    <div className='like_page_container'>
    <TopBar />
    <BottomBar />
    <div className='like_page_title'>
        좋아요 목록
    </div>
    <div className='like_page_1st_line'></div>
    </div>
    )
};

export default Like;