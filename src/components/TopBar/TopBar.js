import React from 'react';
import './TopBar.css';
import { XnixLineSearch4 } from '../static/icons/XnixLineSearch4'; // 상대 경로가 올바른지 확인

const TopBar = () => {
  return (
    <div className="overlap-wrapper">
      <div className="group-wrapper">
        <div className="overlap-group-2">
          <div className="component">
            <img
              className="xnix-line"
              alt="Xnix line"
              src="/static/img/xnix-line-notification-12-1.png"
            />
            <img className="logo-s" alt="Logo s" src="/static/img/logo-s.png" />
            <XnixLineSearch4 className="xnix-line-search" color="#434343" />
            <img
              className="xnix-line-hamburger"
              alt="Xnix line hamburger"
              src="/static/img/xnix-line-hamburger-4-1.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;