import React, { useState, useRef } from 'react';
import './MainPage.css';

const MainPage = () => {
  const [isKeywordSearch, setIsKeywordSearch] = useState(false);
  const leftContainerRef = useRef(null);
  const [searchTags, setSearchTags] = useState([]); // 검색 태그를 배열로 저장
  const searchingInputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  const keywordSearching = () => {
    console.log("키워드 검색 실행!");
    setIsKeywordSearch(true);
    if (leftContainerRef.current && searchingInputRef.current) {
      leftContainerRef.current.classList.add('expand');
      searchingInputRef.current.classList.add('expand-width');
    }
  };

  const visualSearching = () => {
    console.log("비주얼 검색 실행!");
    setIsKeywordSearch(false);
    if (leftContainerRef.current && searchingInputRef.current) {
      leftContainerRef.current.classList.remove('expand');
      searchingInputRef.current.classList.remove('expand-width');
    }
    setSearchTags([]); // 태그 초기화
  };

  const handleClick = () => {
    try {
      window.location.href = '/ResultPage';
      console.log("레시피 결과 보기 성공!");
    } catch {
      console.log("레시피 결과 보기 실패!");
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // 엔터 키를 눌렀을 때 실행할 동작
      if (inputValue.trim()) {
        setSearchTags(prevTags => [...prevTags, { text: inputValue.trim() }]); // 태그 배열 업데이트
        setInputValue('');
      }
      console.log(`엔터 키 입력됨 : ${inputValue}`);
      setIsKeywordSearch(true);
    }
  };

  const removeTag = (index) => {
    setSearchTags(tags => tags.filter((_, i) => i !== index)); // 특정 인덱스의 태그 제거
  };

  return (
    <div className="main-page">
      <div className="recipe-text"
        style={{
          textAlign: 'center',
          position: 'absolute',
          left: isKeywordSearch ? '50%' : 'auto',
          transform: isKeywordSearch ? 'translateX(-50%)' : 'none',
          width: '100%',
        }}>
        {isKeywordSearch && (
          <span className="back-arrow" onClick={visualSearching}>&larr;</span>
        )}
        {isKeywordSearch ? '키워드 검색' : '레시피 찾아보기'}
      </div>
      <div className="select-btn-container">
        <div className="left-container" onClick={keywordSearching} ref={leftContainerRef}>
          <div 
            className="searching-input"
            ref={searchingInputRef}
          >{isKeywordSearch ? (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder=""
            />
          ) : (
            <div className="searching-input-text">키워드 검색</div>
          )}
        </div>
        <div className="search-tags-container" style={{
          }}>
          {searchTags.map((tag, index) => (
            <div className="search-tag" key={index} style={{
              display: 'inline-block',
              }}>
              {tag.text}
              <span 
                className="remove-tag"
                style={{
                  marginLeft: '10px', // 제거 버튼과 태그 사이에 간격 추가
                }}
                onClick={() => removeTag(index)}
              >
                ×
              </span>
            </div>
          ))}
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
