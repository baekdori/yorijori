// App.js
import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import VoronoiPage from './pages/VoronoiPage/VoronoiPage';

const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const SignupPage = lazy(() => import('./pages/SignupPage/SignupPage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const MyPage = lazy(() => import('./pages/MyPage/MyPage'));
const DetailPage = lazy(() => import('./pages/DetailPage/DetailPage'));
const RecipeAddPage = lazy(() => import('./pages/RecipeAddPage/RecipeAddPage'));
const LikePage = lazy(() => import('./pages/FavoritePage/FavoritePage'));
const FavoritePage = lazy(() => import('./pages/FavoritePage/FavoritePage'));
const CategoryPage =lazy(() => import('./pages/CategoryPage/CategoryPage'));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail/CategoryDetail'));

function App() {
  const [selectedResult, setSelectedResult] = useState(null);
  const [favtodetailResult, setFavtodetailResult] = useState(null);
  const [cateTodetailResult, setCateTodetailResult] = useState(null);

  console.log('app.js로 가져온 상세보기 결과', selectedResult, favtodetailResult, cateTodetailResult);

   // DetailPage에 전달할 result 결정
   const getDetailResult = () => {
    if (selectedResult) {
      return selectedResult;
    }
    if (favtodetailResult) {
      return favtodetailResult;
    }
    if (cateTodetailResult) {
      return cateTodetailResult;
    }
  };

  return (
    <Router>
      <div className="App">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<MainPage setSelectedResult={setSelectedResult} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/like" element={<LikePage />} />
            <Route path="/CategoryPage" element={<CategoryPage />} />
            <Route path="/category/:categoryId" element={<CategoryDetail setCateTodetailResult={setCateTodetailResult} />} />
            <Route path="/favorites" element={<FavoritePage setFavtodetailResult={setFavtodetailResult} />} />
            <Route path="/DetailPage/:food_idx" element={<DetailPage result={getDetailResult()} />} />
            <Route path="/RecipeAddPage" element={<RecipeAddPage />} />
            <Route path="/voronoi" element={<VoronoiPage/>} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
