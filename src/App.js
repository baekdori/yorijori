import React from 'react'; // 일단 gpt가 넣어서 넣어놨는데 문제시 삭제예정
import './App.css';
import MainPage from './components/MainPage/MainPage';
import SignupPage from './components/SignupPage/SignupPage';  // SignupPage 컴포넌트 import
import LoginPage from './components/LoginPage/LoginPage';

function App() {
  return (
    <div className="App">
      <MainPage />
      <SignupPage />  {/* SignupPage 컴포넌트 사용 */}
      <LoginPage /> {/* LoginPage 컴포넌트 사용 */}
    </div>
  );
}

export default App;
