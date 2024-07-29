import React, { useState, useEffect } from 'react';
import './TopBar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 컴포넌트가 처음으로 렌더링되어 DOM에 추가될 때, 세션을 통해 로그인 상태를 확인
  useEffect(() => {
    console.log('세션 상태 확인 요청 시작');
    axios.get('http://localhost:4000/check-session')  // 서버에 세션 상태를 확인하기 위한 요청
      .then(response => {
        if (response.data.user) {
          setIsLoggedIn(true);  // 세션에 유저 정보가 있으면 로그인 상태로 설정
          console.log('세션 상태 확인 성공:', response.data);
        } else {
          console.log('세션 상태 확인: 세션 없음');
        }
      })
      .catch(error => {
        console.error('세션 확인 오류:', error);
      });
  }, []);  // 빈 배열을 두 번째 인수로 전달하여 컴포넌트가 처음 렌더링될 때만 실행

  // 로그아웃 버튼 클릭시, axios.post를 사용하여 서버로 로그아웃 요청을 보내고, 세션 종료
  const handleLogout = async () => {
    console.log('로그아웃 요청 시작');
    try {
      const response = await axios.post('http://localhost:4000/logout');
      if (response.status === 200) {
        alert('로그아웃 되었습니다.');
        setIsLoggedIn(false);  // 로그아웃 상태를 false로 변경
        console.log('로그아웃 성공:', response.data);
        window.location.href = '/';
      } else {
        console.log('로그아웃 실패:', response.data);
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <div className="top-bar">
      <a href="/notifications" className="top-bar-item">
        <img className="icon" alt="Notifications" src="/static/img/xnix-line-notification-12-1.png" />
      </a>
      <div className="spacer1"></div> {/* 왼쪽 아이템과 중앙 로고 사이 공간 */}
      <a href="/" className="top-bar-item-logo">
        <img className="icon" alt="Logo" src="/static/img/logo-s.png" />
      </a>
      <div className="spacer2"></div> {/* 왼쪽 아이템과 중앙 로고 사이 공간 */}
      {isLoggedIn ? (
        <button onClick={handleLogout} className="top-bar-item-login">로그아웃</button>
      ) : (
        <Link to="/login" className="top-bar-item-login">로그인</Link>
      )}
      <a href="/search" className="top-bar-item">
        <img className="icon" alt="Search" src="/static/img/search.png" />
      </a>
      <a href="/menu" className="top-bar-item">
        <img className="icon" alt="Menu" src="/static/img/xnix-line-hamburger-4-1.png" />
      </a>
    </div>
  );
};

export default TopBar;
