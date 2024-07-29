import React from 'react';
import './TopBar.css';

const TopBar = () => {
  return (
    <div className="top-bar">
      <a href="/notifications" className="top-bar-item">
        <img className="icon" alt="Notifications" src="/static/img/xnix-line-notification-12-1.png" />
      </a>
      <div className="spacer"></div> {/* 왼쪽 아이템과 중앙 로고 사이 공간 */}
      <a href="/" className="top-bar-item-logo">
        <img className="icon" alt="Logo" src="/static/img/logo-s.png" />
      </a>
      <div className="spacer"></div> {/* 중앙 로고와 오른쪽 아이템 사이 공간 */}
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
