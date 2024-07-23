import React from 'react';
import './MainPage.css';

const MainPage = () => {
  const handleClick = () => {
    try {
      window.location.href = '/ResultPage';
      console.log("레시피 결과 보기 성공!");
    } catch {
      console.log("레시피 결과 보기 실패!");
    }
  };

  return (
    <div className="main-page">
      <div className="food-pic">
        <div className="recipe-text">레시피 찾아보기</div>
        <div className="select-btn-container">
          <div className="left-container">
            <div className="searching-input"></div>
          </div>
          <div className="tiktok"></div>
          <div className="right-container"></div>
        </div>
      </div>
      <div className="recom-container">
        <div className="recom-text">OO님이 좋아할 요리를 찾았어요!</div>
        <div className="recom-subtext">OO님의 기록을 분석하여 찾은 결과입니다</div>
      </div>
      <div className="food-result-top-container">
        <div className="fr" onClick={handleClick}></div>
        <div className="fr" onClick={handleClick}></div>
      </div>
      <div className="food-result-bottom-container">
        <div className="fr" onClick={handleClick}></div>
        <div className="fr" onClick={handleClick}></div>
      </div>
    </div>
  );
};

export default MainPage;