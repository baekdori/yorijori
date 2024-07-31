import React from 'react';
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
  return (
    <Router>
      <div className="App">
       <TopBar /> {/* 공통 컴포넌트 TopBar 추가 */}
        <Routes>
          {/* 라우팅 설정  */}
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/DetailPage" element={<DetailPage />} />
          <Route path="/RecipeAddPage" element={<RecipeAddPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;