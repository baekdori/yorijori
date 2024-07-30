import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './MainPage.css';
import TopBar from '../TopBar/TopBar.js';
import BottomBar from '../BottomBar/BottomBar.js';

const MainPage = () => {
  const [isKeywordSearch, setIsKeywordSearch] = useState(false);
  const [isVisualSearch, setIsVisualSearch] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchTags, setSearchTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState([]);
  const [visualSearchResults, setVisualSearchResults] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const recipeTextRef = useRef(null);

  const fetchSearchResults = async () => {
    try {
      const ingredients = searchTags.map(tag => tag.text).join(',');
      const response = await axios.get('http://localhost:4000/foods/search', {
        params: { q: ingredients }
      });
      const uniqueResults = response.data.reduce((acc, current) => {
        const x = acc.find(item => item.food_idx === current.food_idx);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      setSearchResults(uniqueResults);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const fetchVisualSearchResults = async () => {
    try {
      const ingredients = droppedItems.map(tag => tag.text).join(',');
      const response = await axios.get('http://localhost:4000/foods/search', {
        params: { q: ingredients }
      });
      const uniqueResults = response.data.reduce((acc, current) => {
        const x = acc.find(item => item.food_idx === current.food_idx);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      setVisualSearchResults(uniqueResults);
    } catch (error) {
      console.error('Error fetching visual search results:', error.message);
      console.error('Error details:', error.response ? error.response.data : error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (inputValue.trim()) {
        setSearchTags(prevTags => [...prevTags, { text: inputValue.trim() }]);
        setInputValue('');
      }
      setIsKeywordSearch(true);
      fetchSearchResults(); 
    }
  };

  const handleStartClick = () => {
    if (searchTags.length === 0) {
      alert('반드시 하나 이상의 재료를 입력하세요');
    } else {
      fetchSearchResults(); 
    }
  };

  const removeTag = (index) => {
    setSearchTags(tags => tags.filter((_, i) => i !== index));
  };

  const renderSearchResults = () => {
    const rows = [];
    for (let i = 0; i < searchResults.length; i += 2) {
      rows.push(searchResults.slice(i, i + 1)); // 두 개씩 묶어서 행을 생성
    }
    return (
      <div className="search-results-container">
        {rows.length > 0 ? (
          rows.map((row, rowIndex) => (
            <div key={rowIndex} className="search-results-row">
              {row.map((result) => (
                <div key={result.food_idx} className="result-square">
                  <div className="result-square-text">
                    <h3>{result.food_name}</h3>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="result-square">
            <div className="result-square-text">검색 결과가 없습니다.</div>
          </div>
        )}
      </div>
    );
  };

  const renderVisualSearchResults = () => {
    const rows = [];
    for (let i = 0; i < visualSearchResults.length; i += 2) {
      rows.push(visualSearchResults.slice(i, i + 1));
    }
    return (
      <div className="vs-results-container">
        {rows.length > 0 ? (
          rows.map((row, rowIndex) => (
            <div key={rowIndex} className="vs-results-row">
              {row.map((result) => (
                <div key={result.food_idx} className="result-square">
                  <div className="result-square-text">
                    <h3>{result.food_name}</h3>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="vs-search-result-box">
            <div className="result-square-text">검색 결과가 없습니다.</div>
          </div>
        )}
      </div>
    );
  };

  const keywordSearching = () => {
    setIsKeywordSearch(true);
    setIsVisualSearch(false);
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

  const handleCancelClick = () => {
    setSearchTags([]);
    setInputValue('');
    setShowSearchResult(false);
    setSearchResults([]);
  };

  const vsHandleStartClick = async () => {
    if (droppedItems.length === 0) {
      alert('반드시 하나 이상의 재료를 입력하세요');
    } else {
      setIsTransitioning(true);
      setTimeout(async () => {
        fetchVisualSearchResults(); // Fetch results for visual search
        setShowSearchResult(true);
        setIsTransitioning(false);
      }, 500); 
    }
  };

  const vsHandleCancelClick = () => {
    setSearchTags([]);
    setInputValue('');
    setShowSearchResult(false);
    setSearchResults([]);
    setDroppedItems([]); 
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

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("text/plain", index);
    setDraggedItem(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (droppedItems.length >= 8) {
      alert("아이템 한도에 도달했습니다.");
      return;
    }
    const draggedIndex = event.dataTransfer.getData("text/plain");
    const itemText = itemTexts[draggedIndex];
    if (!droppedItems.find(item => item.text === itemText)) {
      setDroppedItems([...droppedItems, { text: itemText }]);
    }
    setDraggedItem(null);
  };

  const removeDroppedItem = (index) => {
    setDroppedItems(items => items.filter((_, i) => i !== index));
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

  const itemTexts = [
    '돼지고기',
    '닭고기',
    '소고기',
    '오리고기',
    '꿩고기',
    '콩고기',
    '양고기',
    '말고기',
    '칠면조',
    '고기고기'
  ];

  useEffect(() => {
    if (isVisualSearch && droppedItems.length > 0) {
      fetchVisualSearchResults();
    }
  }, [droppedItems, isVisualSearch]);

  return (
    <div className="main-page">
      <TopBar />
      <BottomBar />
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
          <div className="right-container" onClick={visualSearching} onDragOver={handleDragOver} onDrop={handleDrop}>
            <div className="searching-plate">
              {!isVisualSearch && (
                <div className="searching-plate-text">비주얼 검색</div>
              )}
            </div>
          </div>
          {isVisualSearch && (
            <div className={`visual-text-container ${isTransitioning ? 'fade-out' : ''}`}>
              {droppedItems.map((item, index) => (
                <div key={index} className="dropped-item">
                  {item.text}
                  <span className="remove-tag" onClick={() => removeDroppedItem(index)}>×</span>
                </div>
              ))}
            </div>
          )}
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

      {isKeywordSearch && searchResults.length > 0 && renderSearchResults()}

      {isVisualSearch && (
        <>
          <div className="vs-recom-btn-container">
            <div className="ingre-list">재료</div>
            <button className="vs-cancel-btn" onClick={vsHandleCancelClick}>전체 취소</button>
            <button className="vs-start-btn" onClick={vsHandleStartClick}>시작</button>
          </div>
          {!showSearchResult && (
            <div
              className={`item-list-container ${isTransitioning ? 'fade-out' : ''}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {itemTexts.map((text, index) => (
                <div
                  key={index}
                  className={`item-box ${draggedItem === index ? 'dragging' : ''}`}
                  draggable
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragEnd={() => setDraggedItem(null)}
                >
                  <span className="item-text">{text}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isVisualSearch && showSearchResult && visualSearchResults.length > 0 && renderVisualSearchResults()}
    </div>
  );
};

export default MainPage;
