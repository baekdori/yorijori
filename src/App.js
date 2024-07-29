import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './components/MainPage/MainPage';
import SignupPage from './components/SignupPage/SignupPage';
import LoginPage from './components/LoginPage/LoginPage';
import MyPage from './components/MyPage/MyPage';
import DetailPage from './components/DetailPage/DetailPage';
import TopBar from './components/TopBar/TopBar';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 라우팅 설정  */}
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/DetailPage" element={<DetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
