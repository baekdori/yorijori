import React, { useState, useRef } from 'react';
import axios from 'axios';
import './MainPage.css';
import TopBar from '../TopBar/TopBar.js';

const MainPage = () => {
  const [isKeywordSearch, setIsKeywordSearch] = useState(false);
  const [isVisualSearch, setIsVisualSearch] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchTags, setSearchTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const recipeTextRef = useRef(null);

  const keywordSearching = () => {
    setIsKeywordSearch(true);
    setIsVisualSearch(false); // Ensure visual search is disabled
    setShowSearchResult(false);
  };

  const visualSearching = () => {
    setIsKeywordSearch(false);
    setIsVisualSearch(true);
    setShowSearchResult(false);
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

  const vsHandleStartClick = () => {
    if (searchTags.length === 0) {
      alert('반드시 하나 이상의 재료를 입력하세요');
    } else {
      setShowSearchResult(true);
    }
  };

  const vsHandleCancelClick = () => {
    setSearchTags([]);
    setInputValue('');
    setShowSearchResult(false);
    setSearchResults([]);
  };

  const handleKeywordBackClick = () => {
    setIsKeywordSearch(false);
    setSearchTags([]);
    setInputValue('');
    setShowSearchResult(false);
    setSearchResults([]);
  };

  const vsHandleBackClick = () => {
    setIsVisualSearch(false);
    setSearchTags([]);
    setInputValue('');
    setShowSearchResult(false);
    setSearchResults([]);
  };

  const renderRecipeText = () => {
    if (isKeywordSearch && !isVisualSearch) {
      return (
        <>
          <span className="back-arrow" onClick={handleKeywordBackClick}>←</span>
          {'키워드 검색'}
        </>
      );
    } else if (isVisualSearch && !isKeywordSearch) {
      return (
        <>
          <span className="visual-backarrow" onClick={vsHandleBackClick}>←</span>
          {'비주얼 검색'}
        </>
      );
    } else {
      return '레시피 찾아보기';
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
        {!isVisualSearch && (
          <div className={`left-container ${isKeywordSearch ? 'expand' : ''}`} onClick={keywordSearching}>
            <div className={`searching-input ${isKeywordSearch ? 'expand-width' : ''}`}>
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
        )}
        <div className="search-tags-container">
          {searchTags.map((tag, index) => (
            <div className="search-tag" key={index}>
              {tag.text}
              <span className="remove-tag" onClick={() => removeTag(index)}>×</span>
            </div>
          ))}
        </div>
      </div>

      {!isKeywordSearch && !isVisualSearch && (
        <div className="tiktok"></div>
      )}

      {!isKeywordSearch && (
        <>
          <div className="right-container" onClick={visualSearching}>
            <div className="searching-plate">
              {!isVisualSearch && (
                <div className="searching-plate-text">비주얼 검색</div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="food-pic"></div>

      {!isKeywordSearch && !isVisualSearch && (
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

      {isKeywordSearch && (
        <div className="recom-btn-container">
          <div className="search-result-text">검색 결과</div>
          <button className="cancel-btn" onClick={handleCancelClick}>전체 취소</button>
          <button className="start-btn" onClick={handleStartClick}>시작</button>
        </div>
      )}

      {isVisualSearch && (
        <div className="vs-recom-btn-container">
          <div className="ingre-list">재료</div>
          <button className="vs-cancel-btn" onClick={vsHandleCancelClick}>전체 취소</button>
          <button className="vs-start-btn" onClick={vsHandleStartClick}>시작</button>
        </div>
      )}

      {showSearchResult && (
        <div className="search-results-container">
          {searchResults.map((result, index) => (
            <div className="search-result" key={index}>
              {result.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainPage;
