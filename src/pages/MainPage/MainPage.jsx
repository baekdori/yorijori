import React, { useState, useRef, useEffect, Suspense } from 'react'; // React와 React에서 제공하는 훅(useState, useRef, useEffect, Suspense)을 임포트
import { useNavigate } from 'react-router-dom'; // React Router에서 페이지 이동을 위한 useNavigate 훅 임포트
import axios from 'axios'; // HTTP 요청을 위해 axios 라이브러리 임포트
import './MainPage.css'; // 메인 페이지의 스타일링을 위한 CSS 파일 임포트
import TopBar from '../../components/TopBar/TopBar'; // 상단 바 컴포넌트를 임포트
import BottomBar from '../../components/BottomBar/BottomBar'; // 하단 바 컴포넌트를 임포트

// MainPage 컴포넌트 정의. setSelectedResult라는 함수를 props로 받음.
const MainPage = ({ setSelectedResult }) => {
  // 검색 모드와 관련된 상태를 정의
  const [isKeywordSearch, setIsKeywordSearch] = useState(false); // 키워드 검색 모드 활성화 여부
  const [isVisualSearch, setIsVisualSearch] = useState(false); // 비주얼 검색 모드 활성화 여부
  const [showSearchResult, setShowSearchResult] = useState(false); // 검색 결과 표시 여부
  const [searchTags, setSearchTags] = useState([]); // 키워드 검색 시 입력된 태그를 저장
  const [inputValue, setInputValue] = useState(''); // 검색 입력란의 값을 저장
  const [searchResults, setSearchResults] = useState([]); // 키워드 검색 결과 저장
  const [draggedItem, setDraggedItem] = useState(null); // 드래그 중인 아이템을 저장
  const [droppedItems, setDroppedItems] = useState([]); // 비주얼 검색에서 드랍된 아이템들을 저장
  const [visualSearchResults, setVisualSearchResults] = useState([]); // 비주얼 검색 결과 저장
  const [isTransitioning, setIsTransitioning] = useState(false); // 전환 애니메이션 상태 관리
  const [imageList, setImageList] = useState([]); // 이미지 목록 저장
  const [currentImage, setCurrentImage] = useState(''); // 현재 표시 중인 이미지 저장

  const itemListContainerRef = useRef(null); // item-list-container를 참조하기 위한 Ref 생성

  // 로컬 이미지 폴더에서 이미지를 가져오기 위한 코드
  const images = require.context('../../../public/static/img/foodpic', false, /\.(png|jpe?g|svg)$/); 
  const imageArray = images.keys().map(images);

  const recipeTextRef = useRef(null); // 레시피 텍스트를 참조하기 위한 Ref 생성

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  // 세션에 저장된 유저 정보를 가져옴
  const seUser = sessionStorage.getItem('user'); 
  console.log('mainpage에서 확인한 세션아이디 저장값', seUser); // 세션 아이디를 콘솔에 출력

  // 마우스 휠 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault(); // 기본 휠 동작 방지
      if (itemListContainerRef.current) {
        itemListContainerRef.current.scrollLeft += event.deltaY; // 휠 동작에 따라 수평 스크롤
      }
    };
  
    const container = itemListContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false }); // 비활성 스크롤 옵션으로 이벤트 리스너 등록
    }
  
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel); // 컴포넌트 언마운트 시 이벤트 리스너 제거
      }
    };
  }, [itemListContainerRef.current]);

  // 서버에서 추천 레시피를 가져오는 함수
  const logRecommendedRecipes = async () => {
    if (!seUser) return; // 유저가 로그인하지 않았다면 함수 종료

    try {
      const response = await axios.get('http://localhost:4000/random-food-idx', {
        params: { userId: seUser } // 서버에 유저 아이디를 전달
      });
      console.log('추천 레시피:', response.data); // 서버에서 받아온 추천 레시피 데이터를 콘솔에 출력
    } catch (error) {
      console.error('추천 레시피 가져오기 오류:', error); // 오류 발생 시 콘솔에 출력
    }
  };

  // 컴포넌트가 마운트될 때 추천 레시피를 로깅
  useEffect(() => {
    logRecommendedRecipes(); // 추천 레시피 로깅 함수 호출
  }, [seUser]);

  // 키워드 검색 결과를 서버에서 가져오는 함수
  const fetchSearchResults = async () => {
    try {
      const ingredients = searchTags.map(tag => tag.text).join(','); // 검색 태그들을 쉼표로 구분된 문자열로 변환
      const response = await axios.get('http://localhost:4000/foods/search', {
        params: { q: ingredients } // 변환된 문자열을 서버에 전송
      });
      // 중복된 검색 결과를 제거하고 상태에 저장
      const uniqueResults = response.data.reduce((acc, current) => {
        const x = acc.find(item => item.food_idx === current.food_idx); 
        if (!x) {
          return acc.concat([current]); // 중복되지 않는 결과만 추가
        } else {
          return acc; // 중복된 결과는 그대로 반환
        }
      }, []);
      setSearchResults(uniqueResults); // 상태 업데이트
    } catch (error) {
      console.error('Error fetching search results:', error); // 오류 발생 시 콘솔에 출력
    }
  };

  // 비주얼 검색 결과를 서버에서 가져오는 함수
  const fetchVisualSearchResults = async () => {
    try {
      const ingredients = droppedItems.map(tag => tag.text).join(','); // 드랍된 아이템을 쉼표로 구분된 문자열로 변환
      const response = await axios.get('http://localhost:4000/foods/search', {
        params: { q: ingredients } // 변환된 문자열을 서버에 전송
      });
      // 중복된 검색 결과를 제거하고 상태에 저장
      const uniqueResults = response.data.reduce((acc, current) => {
        const x = acc.find(item => item.food_idx === current.food_idx); 
        if (!x) {
          return acc.concat([current]); // 중복되지 않는 결과만 추가
        } else {
          return acc; // 중복된 결과는 그대로 반환
        }
      }, []);
      setVisualSearchResults(uniqueResults); // 상태 업데이트
    } catch (error) {
      console.error('Error fetching visual search results:', error.message); // 오류 발생 시 콘솔에 출력
      console.error('Error details:', error.response ? error.response.data : error); // 오류 세부 사항 출력
    }
  };

  // 키워드 검색 시 Enter 키 입력 처리 함수
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') { // Enter 키가 눌렸을 때
      event.preventDefault(); // 기본 동작 방지
      if (inputValue.trim()) { // 입력값이 비어있지 않으면
        setSearchTags(prevTags => [...prevTags, { text: inputValue.trim() }]); // 검색 태그 추가
        setInputValue(''); // 입력값 초기화
      }
      setIsKeywordSearch(true); // 키워드 검색 모드 활성화
      fetchSearchResults(); // 검색 결과 가져오기
    }
  };

  // 키워드 검색 시작 버튼 클릭 시 처리 함수
  const handleStartClick = () => {
    if (searchTags.length === 0) { // 검색 태그가 하나도 없으면
      alert('반드시 하나 이상의 재료를 입력하세요'); // 경고 메시지 표시
    } else {
      fetchSearchResults(); // 검색 결과 가져오기
    }
  };

  // 등록된 검색어를 제거하는 함수
  const removeTag = (index) => {
    setSearchTags(tags => tags.filter((_, i) => i !== index)); // 해당 인덱스의 태그를 제거
  };

  // 키워드 검색 결과를 렌더링하는 함수
const renderSearchResults = () => {
  console.log('키워드 검색 결과요: ', searchResults); // 디버깅을 위해 검색 결과를 콘솔에 출력
   
  return (
    <div className="search-results-list">
      {searchResults.length > 0 ? ( // 검색 결과가 있을 경우
        searchResults.map((result) => (
          <div className='search-results-container' >
          <div key={result.food_idx} className="result-square" onClick={() => handleResultClick(result)}>         
            <div className="result-square-text">
            <img src={result.ingre_img} className='vs-result-img' alt='food-img'/>
              <h3>{result.food_name}</h3>
            </div>
          </div>
          </div>
        ))
      ) : (
        <div className="result-square">
          <div className="result-square-text">검색 결과가 없습니다.</div> {/* 검색 결과가 없을 때 표시 */}
        </div>
      )}
    </div>
  );
};


  // 비주얼 검색 결과를 렌더링하는 함수
  const renderVisualSearchResults = () => {
    console.log('비주얼 검색 결과 : ', visualSearchResults); // 디버깅을 위해 비주얼 검색 결과를 콘솔에 출력
    return (
      <div className="vs-results-list">
        {visualSearchResults.length > 0 ? ( // 검색 결과가 있을 경우
          visualSearchResults.map((result) => (
            <div className='vs-results-container' >
            <div key={result.food_idx} className="vs-search-result-box" onClick={() => handleResultClick(result)}>         
              <div className="vs-search-result-text">
              <img src={result.ingre_img} className='vs-result-img' alt='food-img'/>
                <h3>{result.food_name}</h3>
              </div>
            </div>
            </div>
          ))
        ) : (
          <div className="vs-search-result-box">
            <div className="result-square-text">검색 결과가 없습니다.</div> {/* 검색 결과가 없을 때 표시 */}
          </div>
        )}
      </div>
    );
  };

  // 검색 결과 클릭 시 처리 함수
  const handleResultClick = (result) => {
    setSelectedResult(result); // 클릭된 결과를 상태로 저장
    navigate('/DetailPage'); // 상세 페이지로 이동
  };

  // 키워드 검색 모드로 전환하는 함수
  const keywordSearching = () => {
    setIsKeywordSearch(true); // 키워드 검색 모드 활성화
    setIsVisualSearch(false); // 비주얼 검색 모드 비활성화
    setShowSearchResult(false); // 검색 결과 표시 비활성화
  };

  // 비주얼 검색 모드로 전환하는 함수
  const visualSearching = () => {
    setIsKeywordSearch(false); // 키워드 검색 모드 비활성화
    setIsVisualSearch(true); // 비주얼 검색 모드 활성화
    setShowSearchResult(false); // 검색 결과 표시 비활성화
  };

  // 레시피 결과 페이지로 이동하는 함수
  const handleClick = () => {
    try {
      window.location.href = '/ResultPage'; // 결과 페이지로 이동
    } catch {
      console.log("레시피 결과 보기 실패!"); // 실패 시 콘솔에 로그 출력
    }
  };

  // 검색 입력값 변경 시 처리 함수
  const handleInputChange = (event) => {
    setInputValue(event.target.value); // 입력값 상태 업데이트
  };

  // 키워드 검색 시 전체 취소 버튼 클릭 시 처리 함수
  const handleCancelClick = () => {
    setSearchTags([]); // 검색 태그 초기화
    setInputValue(''); // 입력값 초기화
    setShowSearchResult(false); // 검색 결과 표시 비활성화
    setSearchResults([]); // 검색 결과 초기화
  };

  // 비주얼 검색 시작 버튼 클릭 시 처리 함수
  const vsHandleStartClick = async () => {
    if (droppedItems.length === 0) { // 드랍된 아이템이 하나도 없을 경우
      alert('반드시 하나 이상의 재료를 입력하세요'); // 경고 메시지 표시
    } else {
      setIsTransitioning(true); // 전환 애니메이션 활성화
      setTimeout(async () => {
        setShowSearchResult(true); // 검색 결과 표시 활성화
        await fetchVisualSearchResults(); // 비주얼 검색 결과 가져오기
        setIsTransitioning(false); // 전환 애니메이션 비활성화
      }, 500); // 500ms 후에 검색 결과 가져오기
    }
  };

  // 비주얼 검색 시 전체 취소 버튼 클릭 시 처리 함수
  const vsHandleCancelClick = () => {
    setSearchTags([]); // 검색 태그 초기화
    setInputValue(''); // 입력값 초기화
    setShowSearchResult(false); // 검색 결과 표시 비활성화
    setSearchResults([]); // 검색 결과 초기화
    setDroppedItems([]); // 드랍된 아이템 초기화
  };

  // 키워드 검색 모드에서 뒤로 가기 버튼 클릭 시 처리 함수
  const handleKeywordBackClick = () => {
    setIsKeywordSearch(false); // 키워드 검색 모드 비활성화
    setSearchTags([]); // 검색 태그 초기화
    setInputValue(''); // 입력값 초기화
    setShowSearchResult(false); // 검색 결과 표시 비활성화
    setSearchResults([]); // 검색 결과 초기화
  };

  // 비주얼 검색 모드에서 뒤로 가기 버튼 클릭 시 처리 함수
  const vsHandleBackClick = () => {
    setIsVisualSearch(false); // 비주얼 검색 모드 비활성화
    setSearchTags([]); // 검색 태그 초기화
    setInputValue(''); // 입력값 초기화
    setShowSearchResult(false); // 검색 결과 표시 비활성화
    setSearchResults([]); // 검색 결과 초기화
    setVisualSearchResults([]); // 비주얼 검색 결과 초기화
    renderVisualSearchResults(); // 비주얼 검색 결과 렌더링 초기화
    fetchVisualSearchResults(); // 비주얼 검색 결과 가져오기 초기화
  };

  // 비주얼 검색 모드에서 드래그 시작 시 처리 함수
  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("text/plain", index); // 드래그된 아이템의 인덱스를 데이터로 설정
    setDraggedItem(index); // 드래그된 아이템 상태 업데이트
  };

  // 비주얼 검색 모드에서 드래그 오버 시 처리 함수
  const handleDragOver = (event) => {
    event.preventDefault(); // 기본 드래그 오버 동작 방지
  };

  // 비주얼 검색 모드에서 드랍 시 처리 함수
  const handleDrop = (event) => {
    event.preventDefault(); // 기본 드랍 동작 방지
    if (droppedItems.length >= 8) { // 드랍된 아이템이 8개 이상일 경우
      alert("아이템 한도에 도달했습니다."); // 경고 메시지 표시
      return;
    }
    const draggedIndex = event.dataTransfer.getData("text/plain"); // 드래그된 아이템의 인덱스를 가져옴
    const item = itemTexts[draggedIndex]; // 해당 인덱스를 통해 아이템을 가져옴
    if (!droppedItems.find(droppedItem => droppedItem.text === item.text)) { // 드랍된 아이템이 이미 목록에 없을 경우
      setDroppedItems([...droppedItems, item]); // 드랍된 아이템 목록에 추가
    }
    setDraggedItem(null); // 드래그된 아이템 상태 초기화
  };

  // 비주얼 검색 모드에서 드랍된 아이템 제거 시 처리 함수
  const removeDroppedItem = (index) => {
    setDroppedItems(items => items.filter((_, i) => i !== index)); // 해당 인덱스의 드랍된 아이템 제거
  };

  // 페이지 제목을 렌더링하는 함수
  const renderRecipeText = () => {
    if (isKeywordSearch && !isVisualSearch) { // 키워드 검색 모드일 경우
      return (
        <>
          <span className="back-arrow" onClick={handleKeywordBackClick}>←</span>
          {'키워드 검색'}
        </>
      );
    } else if (isVisualSearch && !isKeywordSearch) { // 비주얼 검색 모드일 경우
      return (
        <>
          <span className="visual-backarrow" onClick={vsHandleBackClick}>←</span>
          {'비주얼 검색'}
        </>
      );
    } else {
      return '레시피 찾아보기'; // 기본 페이지 제목
    }
  };

  // 비주얼 검색 모드에서 사용할 아이템 텍스트 목록
  const itemTexts = [
    { text: '닭', imageUrl: '/static/img/Chicken.png' },
    { text: '고구마', imageUrl: '/static/img/Sweet potato.png' },
    { text: '양파', imageUrl: '/static/img/Onion.png' },
    { text: '양배추', imageUrl: '/static/img/Cabbage.png' },
    { text: '마늘', imageUrl: '/static/img/Garlic.png' },
    { text: '설탕', imageUrl: '/static/img/Sugar.png' },
    { text: '깻잎', imageUrl: '/static/img/Perilla leaves.png' },
    { text: '고추장', imageUrl: '/static/img/red chili paste.png' },
    { text: '소', imageUrl: '/static/img/Beef.png' },
    { text: '돼지', imageUrl: '/static/img/pork.png' }
  ];

  // 드랍된 아이템이 변경될 때 비주얼 검색 결과를 가져오기 위한 useEffect
  useEffect(() => {
    if (isVisualSearch && droppedItems.length > 0) {
      fetchVisualSearchResults(); // 드랍된 아이템이 있을 경우 검색 결과 가져오기
    }
  }, [droppedItems, isVisualSearch]);

  // 스크롤링 아이템을 렌더링하는 함수
  const renderScrollingItems = () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const duplicatedItems = [...items, ...items]; // 아이템을 두 번 반복하여 스크롤링 리스트 생성

    return (!isKeywordSearch && !isVisualSearch && (
      <>
        <div className="food-result-top-container">
          {duplicatedItems.map((item, index) => (
            <div key={index} className="fr" onClick={handleClick}>{item}</div>
          ))}
        </div>
        <div className="food-result-bottom-container">
          {duplicatedItems.map((item, index) => (
            <div key={index} className="fr" onClick={handleClick}>{item}</div>
          ))}
        </div>
      </>)
    );
  };

  // 이미지 목록을 서버에서 가져오는 함수
  const fetchImages = async () => {
    try {
      const response = await axios.get('/images'); // 서버의 이미지 목록 엔드포인트에서 데이터 가져오기
      setImageList(response.data); // 이미지 목록 상태 업데이트
    } catch (error) {
      console.error('Error fetching images:', error); // 오류 발생 시 콘솔에 출력
    }
  };

  // 컴포넌트가 마운트될 때와 imageList가 변경될 때 실행되는 useEffect
  useEffect(() => {
    fetchImages(); // 이미지 목록 가져오기

    // 20초마다 랜덤 이미지를 선택하여 currentImage 상태 업데이트
    const interval = setInterval(() => {
      if (imageList.length > 0) {
        const randomIndex = Math.floor(Math.random() * imageList.length);
        setCurrentImage(imageList[randomIndex]); 
      }
    }, 10000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 클리어
  }, [imageList]);
  
  return (
    
    <div className="main-page"> {/* 메인 페이지 컨테이너 */}
      <BottomBar /> {/* 하단 바 렌더링 */}  
      <TopBar /> {/* 상단 바 렌더링 */}
      <div
        className="recipe-text"
        ref={recipeTextRef}
        style={{
          textAlign: 'center', // 텍스트 가운데 정렬
          position: 'absolute', // 절대 위치
          left: isKeywordSearch ? '50%' : 'auto', // 키워드 검색 모드일 때 왼쪽 위치 설정
          transform: isKeywordSearch ? 'translateX(-50%)' : 'none', // 키워드 검색 모드일 때 중앙 정렬
          width: '100%', // 너비 100%
        }}
      >
        {renderRecipeText()} {/* 페이지 제목 렌더링 */}
      </div>

      <div className="select-btn-container"> {/* 버튼 컨테이너 */}
        {!isVisualSearch && ( /* 비주얼 검색 모드가 아닐 때만 렌더링 */
          <div className={`left-container ${isKeywordSearch ? 'expand' : ''}`} onClick={keywordSearching}>
            <div className={`searching-input ${isKeywordSearch ? 'expand-width' : ''}`}>
              {isKeywordSearch ? ( /* 키워드 검색 모드일 때 */
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
        <div className="search-tags-container"> {/* 검색 태그 컨테이너 */}
          {searchTags.map((tag, index) => (
            <div className="search-tag" key={index}>
              {tag.text}
              <span className="remove-tag" onClick={() => removeTag(index)}>×</span>
            </div>
          ))}
        </div>
      </div>

      {!isKeywordSearch && !isVisualSearch && ( /* 키워드 검색 및 비주얼 검색 모드가 아닐 때 렌더링 */
        <div className="tiktok"></div>
      )}

      {!isKeywordSearch && (
        <>
          <div className="right-container" onClick={visualSearching} onDragOver={handleDragOver} onDrop={handleDrop}>
          <div className={`searching-plate ${isVisualSearch ? 'active' : ''}`}>
              {!isVisualSearch && (
                <>
                <img className='pizza' src='/static/img/pizza.png'></img>
                <div className="searching-plate-text">비주얼 검색</div>
                </>
              )}
            </div>
          </div>
          {isVisualSearch && (
            <>
              <div className={`visual-text-container ${isTransitioning ? 'fade-out' : ''}`}>
                {droppedItems.map((item, index) => (
                  <div key={index} className="dropped-item">
                    {item.text}
                    <span className="remove-tag" onClick={() => removeDroppedItem(index)}>×</span>
                  </div>
                ))}
              </div>
            </>
          )}

        </>
      )}
       <div className="food-pic">
       {imageArray.map((imageSrc, index) => (
        <Suspense fallback={<div>Loading...</div>} key={index}>
          <img
            src={imageSrc}
            alt={`foodpic-${index}`}
            loading="lazy"
            style={{width : '100%', height : 'auto', opacity : '0.05'}}>
          </img>
        </Suspense>
       ))}
    </div> {/* 음식 사진 컨테이너 */}

      {!isKeywordSearch && !isVisualSearch && (
        <>
          <div className="recom-container">
            <div className="recom-text">{seUser}님이 좋아할 요리를 찾았어요!</div>
            <div className="recom-subtext">{seUser}님의 기록을 분석하여 찾은 결과입니다</div>
          </div>
          {renderScrollingItems()}
        </>
      )}

      {isKeywordSearch && ( /* 키워드 검색 모드일 때 렌더링 */
        <div className="recom-btn-container">
          <div className="search-result-text">검색 결과 보기</div>
          <button className="cancel-btn" onClick={handleCancelClick}>전체 취소</button>
          <button className="start-btn" onClick={handleStartClick}>시작</button>
        </div>
      )}

      {isKeywordSearch && searchResults.length > 0 && renderSearchResults()} {/* 검색 결과가 있을 때 렌더링 */}

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
              ref={itemListContainerRef} // 추가된 부분
            >
              {itemTexts.map((item, index) => (
                <div
                  key={index}
                  className={`item-box ${draggedItem === index ? 'dragging' : ''}`}
                  draggable
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragEnd={() => setDraggedItem(null)}
                >
                  <img src={item.imageUrl} alt={item.text} className="item-image" />
                  <span className="item-text">{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isVisualSearch && showSearchResult && visualSearchResults.length > 0 && renderVisualSearchResults()} {/* 비주얼 검색 결과 렌더링 */}
    </div>
  );
};

export default MainPage; /* MainPage 컴포넌트 내보내기 */
