import React from 'react';
import axios from 'axios'
import './MyPage.css';

const MyPage = () => {
  const [formData, setFormData] = useState({    // useState 훅을 사용하여 formData 상태 정의
    userId: '',
    nickname: '',
    phone: '',
    email: '',
    joinDate: ''
  });

  // 페이지 로드 시 사용자 정보 불러오기
  // useEffect 훅을 사용하여 컴포넌트가 처음 렌더링 될 때 fetchUserData 함수 호출 
  useEffect(() => {
    const userId = 'testUser'; // 예시로 사용자 ID를 설정
    fetchUserData(userId);
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:4000/user/${userId}`);
      setFormData({
        userId: response.data.user_id,
        nickname: response.data.user_nick,
        phone: response.data.user_phone,
        email: response.data.user_email,
        joinDate: response.data.joined_at
      });
    } catch (error) {
      console.error('사용자 정보 불러오기 오류:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:4000/user/mypage/${formData.userId}`, {
        user_nick: formData.nickname,
        user_phone: formData.phone,
        user_email: formData.email
      });
      if (response.status === 200) {
        alert('회원정보가 성공적으로 수정되었습니다.');
      } else {
        alert('회원정보 수정 실패');
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