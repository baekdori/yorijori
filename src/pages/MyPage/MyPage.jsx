// MyPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPage.css';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {

  // useNavigate 훅
  const navigate = useNavigate();
  // 사용자 데이터 상태와 수정가능여부 관리하는 상태를 정의
  const [userData, setUserData] = useState({
    user_id: '',
    user_name: '',
    user_nick: '',
    user_phone: '',
    user_email: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // 컴포넌트가 처음 렌더링 될 때 사용자 정보 불러오기
  useEffect(() => {
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


  // 입력값 변경
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });  // 입력된 값에 따라 userData 상태를 업데이트
    console.log(`입력값 변경 - ${name}: ${value}`);
  };

  // 수정 버튼 클릭
  const handleCorrectionClick = () => {
    setIsEditing(true);   // 수정모드 활성화
    console.log('수정 모드 활성화');
  };

  // 확인 버튼 클릭 (회원 정보 수정)
  const handleSubmitClick = async () => {
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
  };
  
  // 회원 탈퇴 버튼 클릭
  const handleDeleteClick = async () => {
    const myUser = sessionStorage.getItem('user'); // 세션에서 유저 정보를 다시 가져옴
    const confirmDelete = window.confirm('정말로 회원 탈퇴를 하시겠습니까?');
    if (!confirmDelete) return;

    try {
      // 백엔드 서버(4000)로 요청 보내서 사용자 데이터 삭제
      console.log('회원 탈퇴 요청 전송:', myUser);
      const response = await axios.delete(`http://localhost:4000/user/mypage/delete`, { data: { user: myUser }, withCredentials: true });
      console.log('서버 응답 데이터:', response.data);
      if (response.status === 200) {
        alert('회원 탈퇴가 성공적으로 완료되었습니다.');
        console.log('회원 탈퇴 응답:', response.data);
        sessionStorage.clear(); // 세션에서 모든 항목 삭제
        window.location.href = "/login"  // 탈퇴 후 로그인 페이지로 이동
      } else {
        alert('회원 탈퇴 실패');
        console.error('회원 탈퇴 실패:', response);
      }
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생~~~~~~~:', error);
      alert('회원 탈퇴 도중 오류 발생');
    }
  };

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
