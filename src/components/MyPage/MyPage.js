import React from 'react';
import './MyPage.css';

const MyPage = () => {
  return (
    <div className="mypage">
      <div className="title">마이페이지</div>
      <div className="first-line"></div>
      <div className="id-container">
        <div className="picture-circle"></div>
        <div className="id-info">
          <div className="id">ID</div>
          <div className="input-prompt">본문 내용을 입력하세요</div>
          <div className="name">이름</div>
          <div className="input-prompt">본문 내용을 입력하세요</div>
        </div>
      </div>
      <div className="second-line"></div>
      <div className="join-date">닉네임</div>
      <div className="input-prompt">본문 내용을 입력하세요</div>
      <div className="phone">핸드폰</div>
      <div className="input-prompt">본문 내용을 입력하세요</div>
      <div className="email">이메일</div>
      <div className="input-prompt">본문 내용을 입력하세요</div>
      <div className="recipe-list">내 레시피 목록</div>
       
      <button className="cancel-btn">취소</button>
      <button className="correction-btn">수정</button>
    </div>
  );
}

export default MyPage;