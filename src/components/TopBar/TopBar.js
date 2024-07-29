import React, { useState, useEffect } from 'react';
import './TopBar.css';
import { Link } from 'react-router-dom';

const TopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // This effect simulates checking login state
  useEffect(() => {
    // Replace this with actual logic to check login state
    const loggedIn = localStorage.getItem('loggedIn') === 'true'; 
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    // Clear login state and redirect
    localStorage.setItem('loggedIn', 'false');
    setIsLoggedIn(false);
    // Navigate to the home page or login page
    window.location.href = '/';
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
