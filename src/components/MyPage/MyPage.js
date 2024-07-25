import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPage.css';

const MyPage = () => {
  const [userData, setUserData] = useState({
    user_nick: '',
    user_phone: '',
    user_email: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user data when the component mounts
    axios.get('/api/user/profile') // Adjust the endpoint as necessary
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the user data!', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleCorrectionClick = () => {
    setIsEditing(true);
  };

  const handleSubmitClick = () => {
    axios.put('/api/user/profile', userData) // Adjust the endpoint as necessary
      .then(response => {
        setIsEditing(false);
        alert('User data updated successfully!');
      })
      .catch(error => {
        console.error('There was an error updating the user data!', error);
        alert('Failed to update user data.');
      });
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