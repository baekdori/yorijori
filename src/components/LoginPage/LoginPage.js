import axios from 'axios'; // npm install axios 필요
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';


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
    console.log('로그인 시도:', formData);
    try {
      const response = await axios.post("http://localhost:4000/user/login", formData);  // axios를 사용하여 백엔드 서버로 POST 요청 보냄
      console.log('22222222222222222222222222222여기부터 콘솔이 안찍힘!!!!!!!!!1로그인을하면 정보가 게속 담겨있어야 할 것 같은데 어디에 담겨있어야할깡', response.data); // 서버 응답 출력
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

  // 회원가입 페이지로 이동하는 함수
  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div>
      <div className="screen">
        <img className="logo-b" alt="Logo s" src="/static/img/logo-s.png" />

      
      <form>
        <div className="group">
          <div className="view-l">
          <img className="loginuser" alt="loginuser" src="/static/img/loginuser.png" />
            <input
              type="text"
              id="user_id"
              name="user_id"
              placeholder="아이디 입력"
              value={formData.user_id}
              onChange={handleChange}
              required
              className="input-field-l"
            />
          </div>

          <div className="view-2-l">
          <img className="lock" alt="lock" src="/static/img/lock.png" />
            <input
              type="password"
              id="user_pw"
              name="user_pw"
              placeholder="비밀번호 입력"
              value={formData.user_pw}
              onChange={handleChange}
              required
              className="input-field-l"
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" name="remember" />
              아이디 저장
            </label>
            <div className="links">
            <a href="/find-id" className="link">아이디 찾기</a>
            <span className="divider">|</span>
            <a href="/find-password" className="link">비밀번호 찾기</a>
            </div>
          </div>
           
          <button type="submit" onClick={handleLogin} className="view-10">로그인</button>
          <button type="button" onClick={handleSignup} className="view-9">회원가입</button>
        </div>
      </form>


    </div>
    </div>
  );
};

export default LoginPage;
