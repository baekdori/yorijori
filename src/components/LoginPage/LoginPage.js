import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 로그인 로직을 추가하세요
    navigate('/'); // 로그인 성공 시 메인 페이지로 이동
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>로그인</button>
      <Link to="/signup">회원가입</Link>
    </div>
  );
};

export default LoginPage;
