import React from 'react';
import './MyPage.css';

// 하은 4000포트로 보내는 코드입력할예정

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
          <div className="nickname">닉네임</div>
          <div className="input-prompt">본문 내용을 입력하세요</div>
        </div>
      </div>
      <div className="second-line"></div>
      <div className="join-date">가입일자</div>
      <div className="input-prompt">본문 내용을 입력하세요</div>
      <div className="phone">핸드폰</div>
      <div className="input-prompt">본문 내용을 입력하세요</div>
      <div className="email">이메일</div>
      <div className="input-prompt">본문 내용을 입력하세요</div>
      <div className="recipe-list">내 레시피 목록</div>
      <table className="recipe-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
            <th>댓글 수</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {/* 여기에 레시피 목록 아이템들이 들어갈 예정입니다. */}
        </tbody>
      </table>
      <button className="cancel-btn">취소</button>
      <button className="correction-btn">수정</button>
    </div>
  );
}

export default MyPage;