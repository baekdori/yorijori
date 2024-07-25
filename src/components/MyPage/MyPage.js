import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPage.css';

const MyPage = () => {
  // 사용자 데이터 상태와 수정가능여부 관리하는 상태를 정의
  const [userData, setUserData] = useState({
    user_nick: '',
    user_phone: '',
    user_email: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // 컴포넌트가 처음 렌더링 될 때 사용자 정보 불러오기
  useEffect(() => {
    axios.get('/api/user/profile')  // 백엔드 서버에서 사용자의 프로필 데이터 가져오는 요청
      .then(response => {
        setUserData(response.data);
        console.log('사용자 정보 불러오기 성공:', response.data);
      })
      .catch(error => {
        console.error('사용자 정보 불러오기 오류:', error);
      });
  }, []);    // 빈 배열([])을 두 번째 인수로 전달하여 컴포넌트가 처음 렌더링될 때만 이 효과를 실행

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

  // 확인 버튼 클릭
  const handleSubmitClick = async () => {
    try {
      // 백엔드 서버(4000)로 POST 요청보내서 수정된 사용자 데이터 전송
      const response = await axios.put("http://localhost:4000/user/mypage", userData); 
      console.log('서버 응답 데이터:', response.data);
      if (response.status === 200) {
        setIsEditing(false);  // 서버로부터 성공 응답 받으면, 수정모드를 비활성화
        alert('회원정보가 성공적으로 수정되었습니다.');
        console.log('회원정보 수정 응답:', response.data);
      } else {
        alert('회원정보 수정 실패');
        console.error('회원정보 수정 실패:', response);
      }
    } catch (error) {
      console.error('회원정보 수정 중 오류 발생:', error);
      alert('회원정보 수정 도중 오류 발생');
    }
  };


  return (
    <div className="mypage">
      <div className="title">마이페이지</div>
      <div className="first-line"></div>
      <div className="id-container">
        <div className="picture-circle"></div>
        <div className="id-info">
          <div className="id">ID</div>
          <div className="input-prompt">아이디</div>
          <div className="name">이름</div>
          <div className="input-prompt">이름</div>
        </div>
      </div>
      <div className="second-line"></div>
      <div className="nickname">닉네임</div>
      <input
        type="text" /* 수정 버튼을 눌러야 input 칸 선택 가능 */
        className="nick-input"
        name="user_nick"
        value={userData.user_nick}
        onChange={handleInputChange}
        readOnly={!isEditing}
        style={{ userSelect: isEditing ? 'auto' : 'none' }}
      /> 
      <div className="phone">핸드폰</div> 
      <input
        type="text" /* 수정 버튼을 눌러야 input 칸 선택 가능 */
        className="phone-input"
        name="user_phone"
        value={userData.user_phone}
        onChange={handleInputChange}
        readOnly={!isEditing}
        style={{ userSelect: isEditing ? 'auto' : 'none' }}
      />
      <div className="email">이메일</div>
      <input
        type="text" /* 수정 버튼을 눌러야 input 칸 선택 가능 */
        className="email-input"
        name="user_email"
        value={userData.user_email}
        onChange={handleInputChange}
        readOnly={!isEditing}
        style={{ userSelect: isEditing ? 'auto' : 'none' }}
      />
      <button className="correction-btn" onClick={handleCorrectionClick}>수정</button>
      <button className="submit-btn" onClick={handleSubmitClick} disabled={!isEditing}>확인</button>
    </div>
  );
};

export default MyPage;