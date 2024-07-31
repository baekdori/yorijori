import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './components/MainPage/MainPage';
import SignupPage from './components/SignupPage/SignupPage';
import LoginPage from './components/LoginPage/LoginPage';
import MyPage from './components/MyPage/MyPage';
import DetailPage from './components/DetailPage/DetailPage';
import TopBar from './components/TopBar/TopBar';
import RecipeAddPage from './components/RecipeAddPage/RecipeAddPage';

function App() {
  const [selectedResult, setSelectedResult] = useState(null);
  console.log('app.js로 가져온 상세보기 결과',selectedResult)

  return (
    <Router>
      <div className="App">
       <TopBar /> {/* 공통 컴포넌트 TopBar 추가 */}
        <Routes>
          {/* 라우팅 설정  */}
          <Route path="/" element={<MainPage setSelectedResult={setSelectedResult}/>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/DetailPage" element={<DetailPage result={selectedResult}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;