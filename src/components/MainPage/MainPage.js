import React, { useState } from 'react';
import './MainPage.css';

const MainPage = () => {
  const [isKeywordSearch, setIsKeywordSearch] = useState(false);

  const keywordSearching = () => {
    console.log("키워드 검색 실행!");
    setIsKeywordSearch(true);
    // 키워드 검색 관련 로직을 여기에 추가
  };

  const visualSearching = () => {
    console.log("비주얼 검색 실행!");
    // 비주얼 검색 관련 로직을 여기에 추가
  };

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
      <div className="recipe-text">레시피 찾아보기</div>
      <div className="select-btn-container">
        <div className="left-container" onClick={keywordSearching}>
          <div className="searching-input">
            <div className="searching-input-text">키워드 검색</div>
          </div>
        </div>
        {!isKeywordSearch && (
          <>
            <div className="tiktok"></div>
            <div className="right-container" onClick={visualSearching}>
              <div className="searching-plate">
                <div className="searching-plate-text">비주얼 검색</div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="food-pic"></div>
      {!isKeywordSearch && (
        <>
          <div className="recom-container">
            <div className="recom-text">OO님이 좋아할 요리를 찾았어요!</div>
            <div className="recom-subtext">OO님의 기록을 분석하여 찾은 결과입니다</div>
          </div>
          <div className="food-result-top-container">
            <div className="fr" onClick={handleClick}></div>
            <div className="fr" onClick={handleClick}></div>
            <div className="fr" onClick={handleClick}></div>
          </div>
          <div className="food-result-bottom-container">
            <div className="fr" onClick={handleClick}></div>
            <div className="fr" onClick={handleClick}></div>
            <div className="fr" onClick={handleClick}></div>
          </div>
        </>
      )}
    </div>
  );
};

export default MainPage;
