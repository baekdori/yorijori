import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // npm install axios 필요
import React, { useState } from 'react';




const LoginPage = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옴
  const [formData, setFormData] = useState({  // 상태 관리
    username: '',
    password: ''
  });

  // 입력 값 변경을 처리하는 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`입력 값 변경 - ${name}: ${value}`); // 입력 값 변경 출력
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출의 기본 동작인 페이지 리로드 방지
    console.log('로그인 시도:', formData); // 로그인 시도 로그 출력
    try {
      const response = await axios.post("http://localhost:4000/user/login", formData);  // axios를 사용하여 백엔드 서버로 POST 요청 보냄
      console.log('서버 응답:', response.data); // 서버 응답 출력
      if (response.status === 200) {
        alert('로그인 성공');
        navigate('/'); // 로그인 성공 시 메인 페이지로 이동
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('로그인 도중 오류 발생');   // 네트워크 오류 등의 예외상황을 catch 블록에서 처리하여 오류메세지 표시
    }
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
