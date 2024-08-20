import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

const MainPage = lazy(() => import('./components/MainPage/MainPage'));
const SignupPage = lazy(() => import('./components/SignupPage/SignupPage'));
const LoginPage = lazy(() => import('./components/LoginPage/LoginPage'));
const MyPage = lazy(() => import('./components/MyPage/MyPage'));
const DetailPage = lazy(() => import('./components/DetailPage/DetailPage'));
const RecipeAddPage = lazy(() => import('./components/RecipeAddPage/RecipeAddPage'));
const Like = lazy(() => import('./components/Like/Like'));

function App() {
  const [selectedResult, setSelectedResult] = useState(null);
  console.log('app.js로 가져온 상세보기 결과', selectedResult);

  return (
    <Router>
      <div className="App">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<MainPage setSelectedResult={setSelectedResult} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/like" element={<Like />} />
            <Route path="/DetailPage" element={<DetailPage result={selectedResult} />} />
            <Route path="/RecipeAddPage" element={<RecipeAddPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
