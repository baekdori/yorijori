import React, { useState, useRef } from 'react';
import axios from 'axios';
import './MainPage.css';
import TopBar from '../TopBar/TopBar.js';

const MainPage = () => {
  const [isKeywordSearch, setIsKeywordSearch] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchTags, setSearchTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const leftContainerRef = useRef(null);
  const searchingInputRef = useRef(null);
  const tiktokRef = useRef(null);
  const recomContainerRef = useRef(null);
  const foodResultTopContainerRef = useRef(null);
  const foodResultBottomContainerRef = useRef(null);
  const recipeTextRef = useRef(null);

  const keywordSearching = () => {
    setIsKeywordSearch(true);
    if (leftContainerRef.current && searchingInputRef.current) {
      leftContainerRef.current.classList.add('expand');
      searchingInputRef.current.classList.add('expand-width');
      console.log("키워드 검색 시작");
    }
  };

  const visualSearching = () => {
    setIsKeywordSearch(false);
    setShowSearchResult(false);

    // Hide elements
    if (leftContainerRef.current) {
      leftContainerRef.current.style.display = 'none';
    }
    if (searchingInputRef.current) {
      searchingInputRef.current.style.display = 'none';
    }
    if (tiktokRef.current) {
      tiktokRef.current.style.display = 'none';
    }
    if (recomContainerRef.current) {
      recomContainerRef.current.style.display = 'none';
    }
    if (foodResultTopContainerRef.current) {
      foodResultTopContainerRef.current.style.display = 'none';
    }
    if (foodResultBottomContainerRef.current) {
      foodResultBottomContainerRef.current.style.display = 'none';
    }

    // Update recipe-text
    if (recipeTextRef.current) {
      recipeTextRef.current.textContent = '비주얼 검색';
    }
  };

  const handleClick = () => {
    try {
      window.location.href = '/ResultPage';
    } catch {
      console.log("레시피 결과 보기 실패!");
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (inputValue.trim()) {
        setSearchTags(prevTags => [...prevTags, { text: inputValue.trim() }]);
        setInputValue('');
      }
      setIsKeywordSearch(true);

      // Fetch search results
      const ingredients = searchTags.map(tag => tag.text);
      try {
        const response = await axios.post('/api/search', { ingredients });
        setSearchResults(response.data);
        setShowSearchResult(true);
      } catch (error) {
        console.error("검색 결과 가져오기 실패!", error);
      }
    }
  };

  const removeTag = (index) => {
    setSearchTags(tags => tags.filter((_, i) => i !== index));
  };

  const handleStartClick = () => {
    if (searchTags.length === 0) {
      alert('반드시 하나 이상의 재료를 입력하세요');
    } else {
      setShowSearchResult(true);
    }
  };

  const handleCancelClick = () => {
    setSearchTags([]);
    setInputValue('');
    setShowSearchResult(false);
    setSearchResults([]);
  };

  const renderRecipeText = () => {
    if (isKeywordSearch) {
      return (
        <>
          <span className="back-arrow" onClick={visualSearching}>←</span>
          {'키워드 검색'}
        </>
      );
    } else if (recipeTextRef.current && recipeTextRef.current.textContent === '비주얼 검색') {
      return (
        <>
          <span className="back-arrow" onClick={keywordSearching}>←</span>
          {'비주얼 검색'}
        </>
      );
    } else {
      return (
        <>
          {'레시피 찾아보기'}
        </>
      );
    }
  };

  return (
    <div className="main-page">
      <TopBar />
      <div
        className="recipe-text"
        ref={recipeTextRef}
        style={{
          textAlign: 'center',
          position: 'absolute',
          left: isKeywordSearch ? '50%' : 'auto',
          transform: isKeywordSearch ? 'translateX(-50%)' : 'none',
          width: '100%',
        }}
      >
        {renderRecipeText()}
      </div>
      <div className="select-btn-container">
        <div className="left-container" onClick={keywordSearching} ref={leftContainerRef}>
          <div className="searching-input" ref={searchingInputRef}>
            {isKeywordSearch ? (
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
        </div>
        <div className="search-tags-container">
          {searchTags.map((tag, index) => (
            <div className="search-tag" key={index}>
              {tag.text}
              <span className="remove-tag" onClick={() => removeTag(index)}>×</span>
            </div>
          ))}
        </div>
      </div>

      {!isKeywordSearch && (
        <>
          <div className="tiktok" ref={tiktokRef}></div>
          <div className="right-container" onClick={visualSearching}>
            <div className="searching-plate">
              <div className="searching-plate-text">비주얼 검색</div>
            </div>
          </div>
        </>
      )}

      <div className="food-pic"></div>
      {!isKeywordSearch && (
        <>
          <div className="recom-container" ref={recomContainerRef}>
            <div className="recom-text">OO님이 좋아할 요리를 찾았어요!</div>
            <div className="recom-subtext">OO님의 기록을 분석하여 찾은 결과입니다</div>
          </div>
          <div className="food-result-top-container" ref={foodResultTopContainerRef}>
            <div className="fr" onClick={handleClick}></div>
            <div className="fr" onClick={handleClick}></div>
            <div className="fr" onClick={handleClick}></div>
          </div>
          <div className="food-result-bottom-container" ref={foodResultBottomContainerRef}>
            <div className="fr" onClick={handleClick}></div>
            <div className="fr" onClick={handleClick}></div>
            <div className="fr" onClick={handleClick}></div>
          </div>
        </>
      )}

      {isKeywordSearch && (
        <div className="recom-btn-container">
          <div className="search-result-text">검색 결과</div>
          <button className="cancel-btn" onClick={handleCancelClick}>전체 취소</button>
          <button className="start-btn" onClick={handleStartClick}>시작</button>
        </div>
      )}

      {showSearchResult && (
        <div className="search-result-container">
          {searchResults.map((result, index) => (
            <div
              className="result-square"
              key={index}
              style={{
                left: `${(index % 3) * 220}px`,
                top: `${Math.floor(index / 3) * 80}px`,
              }}
            >
              <div className="result-square-text">{result.food_name}</div>
              <div className="result-square-idx">{result.food_idx}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainPage;
