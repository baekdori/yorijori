import React, { useState, useEffect } from 'react'; // React와 useState, useEffect 훅을 가져옴
import './TopBar.css'; // CSS 파일을 가져와 스타일 적용
import { Link, useNavigate } from 'react-router-dom'; // Link와 페이지 이동을 위한 useNavigate 훅을 가져옴
import axios from 'axios'; // Axios 라이브러리 가져옴 (HTTP 요청을 위해 사용)

const TopBar = () => {
  // 로그인 상태와 사용자 정보를 관리하기 위한 state 선언
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 관리하는 상태
  const [user, setUser] = useState(null); // 로그인한 사용자 정보를 관리하는 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 컴포넌트가 처음 렌더링될 때 세션을 통해 로그인 상태를 확인
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user'); // 세션에서 사용자 정보를 가져옴
    if (storedUser) { // 만약 사용자 정보가 있다면
      setIsLoggedIn(true); // 로그인 상태로 설정
      setUser(JSON.parse(storedUser)); // 문자열로 저장된 세션 값을 객체로 변환하여 사용자 상태로 설정
    }
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행

  // 로그아웃 버튼을 클릭했을 때 실행되는 함수
  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청을 보냄
      const response = await axios.post('http://localhost:4000/user/logout', {}, { withCredentials: true });
      if (response.data.message === '로그아웃 완료') { // 로그아웃이 성공적으로 완료되면
        sessionStorage.clear(); // 세션에 저장된 사용자 정보를 모두 삭제
        setIsLoggedIn(false); // 로그인 상태를 false로 변경 (로그아웃 상태)
        alert("로그아웃합니다."); // 로그아웃 알림
        window.location.href = "/"; // 메인 페이지로 이동
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error); // 로그아웃 중 오류 발생 시 콘솔에 출력
    }
  };

  return (
    // TopBar를 구성하는 HTML 요소를 반환
    <div className="top-bar">
      <a href="/notifications" className="top-bar-item">
        <img className="icon" alt="Notifications" src="/static/img/xnix-line-notification-12-1.png" /> {/* 알림 아이콘 */}
      </a>
      <div className="spacer1"></div> {/* 왼쪽 아이템과 중앙 로고 사이의 간격을 조정 */}
      <a href="/" className="top-bar-item-logo">
        <img className="icon" alt="Logo" src="/static/img/logo-s.png" /> {/* 중앙 로고 */}
      </a>
      <div className="spacer2"></div> {/* 중앙 로고와 오른쪽 아이템 사이의 간격을 조정 */}
      
      {/* 로그인 상태에 따라 로그인/로그아웃 버튼을 표시 */}
      {isLoggedIn ? (
        <button onClick={handleLogout} className="top-bar-item-login">로그아웃</button> // 로그인 상태면 로그아웃 버튼
      ) : (
        <Link to="/login" className="top-bar-item-login">로그인</Link> // 로그아웃 상태면 로그인 버튼
      )}
      
      <a href="/menu" className="top-bar-item">
        <img className="icon" alt="Menu" src="/static/img/xnix-line-hamburger-4-1.png" /> {/* 메뉴 아이콘 */}
      </a>
    </div>
  );
};

export default TopBar; // TopBar 컴포넌트를 내보냄
