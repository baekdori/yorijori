import React from 'react';
import { useLocation } from 'react-router-dom';
import './BottomBar.css';

const BottomBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bottom-nav">
      <a href="/category" className="nav-item">
        <img
          className="categ"
          alt="Category"
          src={currentPath === '/category' ? '/static/img/puzzle.png' : '/static/img/whitePuzzle.png'}
        />
        <span style={{ color: currentPath === '/category' ? '#FF8000' : '#FFF' }}>카테고리</span>
      </a>
      <a href="/RecipeAddPage" className="nav-item">
        <img
          className="post"
          alt="Post"
          src={currentPath === '/RecipeAddPage' ? '/static/img/message.png' : '/static/img/whiteMessage.png'}
        />
        <span style={{ color: currentPath === '/RecipeAddPage' ? '#FF8000' : '#FFF' }}>게시글 작성</span>
      </a>
      <a href="/" className="nav-item">
        <img
          className="home"
          alt="Home"
          src={currentPath === '/' ? '/static/img/home.png' : '/static/img/whiteHome.png'}
        />
        <span style={{ color: currentPath === '/' ? '#FF8000' : '#FFF' }}>홈</span>
      </a>
      <a href="/like" className="nav-item">
        <img
          className="like"
          alt="Like"
          src={currentPath === '/like' ? '/static/img/heart.png' : '/static/img/whiteHeart.png'}
        />
        <span style={{ color: currentPath === '/like' ? '#FF8000' : '#FFF' }}>좋아요</span>
      </a>
      <a href="/mypage" className="nav-item">
        <img
          className="mypage"
          alt="MyPage"
          src={currentPath === '/mypage' ? '/static/img/users.png' : '/static/img/whiteUsers.png'}
        />
        <span style={{ color: currentPath === '/mypage' ? '#FF8000' : '#FFF' }}>내 정보</span>
      </a>
    </div>
  );
};

export default BottomBar;