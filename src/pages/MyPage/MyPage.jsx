// MyPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './MyPage.css';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {

  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    user_id: '',
    user_name: '',
    user_nick: '',
    user_phone: '',
    user_email: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // 사용자 정보를 불러오는 함수에 useCallback 적용
  const fetchUserData = useCallback(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      alert("로그인 하셔야 합니다.");
      navigate('/login');
      return;
    }

    const myUser = JSON.parse(storedUser);
    axios.post('http://localhost:4000/user/mypage/profile', { user_id: myUser.user_id }, { withCredentials: true })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('사용자 정보 불러오기 오류:', error.response);
      });
  }, [navigate]);

  useEffect(() => {
    fetchUserData(); // useCallback으로 묶인 fetchUserData 호출
  }, [fetchUserData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
    console.log(`입력값 변경 - ${name}: ${value}`);
  }, []);

  const handleCorrectionClick = useCallback(() => {
    setIsEditing(true);
    console.log('수정 모드 활성화');
  }, []);

  const handleSubmitClick = useCallback(async () => {
    try {
      const response = await axios.put("http://localhost:4000/user/mypage/edit", userData, { withCredentials: true });
      if (response.status === 200) {
        setIsEditing(false);
        alert('회원정보가 성공적으로 수정되었습니다.');
      } else {
        alert('회원정보 수정 실패');
      }
    } catch (error) {
      console.error('회원정보 수정 중 오류 발생:', error);
      alert('회원정보 수정 도중 오류 발생');
    }
  }, [userData]);

  const handleDeleteClick = useCallback(async () => {
    const myUser = sessionStorage.getItem('user');
    const confirmDelete = window.confirm('정말로 회원 탈퇴를 하시겠습니까?');
    if (!confirmDelete) return;

    try {
      console.log('회원 탈퇴 요청 전송:', myUser);
      const response = await axios.delete(`http://localhost:4000/user/mypage/delete`, 
        { data: { user: myUser }, withCredentials: true });
      console.log('서버 응답 데이터:', response.data);
      if (response.status === 200) {
        alert('회원 탈퇴가 성공적으로 완료되었습니다.');
        sessionStorage.clear();
        window.location.href = "/login";
      } else {
        alert('회원 탈퇴 실패');
        console.error('회원 탈퇴 실패:', response);
      }
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error);
      alert('회원 탈퇴 도중 오류 발생');
    }
  }, []);

  return (
    <div className="mypage-container">
      <TopBar />
      <div className="mypage-title">마이페이지</div>

      <div className="mypage-first-line"></div>

      <div className="mypage-id-container">
        <div className="mypage-picture-circle">
          <img src="/static/img/animal_hamster.png" alt="프로필 이미지" className="mypage-picture" />
        </div>
        <div className="mypage-id-info">
          <div className="mypage-id">ID</div>
          <div className="mypage-input-prompt">{userData.user_id}</div>
          <div className="mypage-name">이름</div>
          <div className="mypage-input-prompt">{userData.user_name}</div>
        </div>
      </div>

      <div className="mypage-second-line"></div>

      <div className="mypage-nickname">닉네임</div>
      <input
        type="text"
        className="mypage-input"
        name="user_nick"
        value={userData.user_nick}
        onChange={handleInputChange}
        readOnly={!isEditing}
        style={{ userSelect: isEditing ? 'auto' : 'none' }}
      />

      <div className="mypage-phone">핸드폰</div>
      <input
        type="text"
        className="mypage-input"
        name="user_phone"
        value={userData.user_phone}
        onChange={handleInputChange}
        readOnly={!isEditing}
        style={{ userSelect: isEditing ? 'auto' : 'none' }}
      />

      <div className="mypage-email">이메일</div>
      <input
        type="text"
        className="mypage-input"
        name="user_email"
        value={userData.user_email}
        onChange={handleInputChange}
        readOnly={!isEditing}
        style={{ userSelect: isEditing ? 'auto' : 'none' }}
      />

      <button className="mypage-delete-account-btn" onClick={handleDeleteClick}>
        회원 탈퇴
      </button>

      <BottomBar />

      <button className="mypage-correction-btn" onClick={handleCorrectionClick}>수정</button>
      <button className="mypage-submit-btn" onClick={handleSubmitClick} disabled={!isEditing}>확인</button>
    </div>
  );
};

export default MyPage;
