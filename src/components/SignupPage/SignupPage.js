import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    nickname: '',
    phone: '',
    gender: '',
    email: ''
  });

  const [imageSrc, setImageSrc] = useState('/static/img/rectangle-1.png'); // 이미지 경로를 상태로 관리

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호 일치하지 않음');
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/user/signup", formData);
      if (response.status === 200) {
        alert('회원가입 성공');
        navigate('/login');
      } else {
        alert('회원가입 실패');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('회원가입 도중 오류 발생');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="screen">
      <div className="overlap-wrapper">
        <div className="overlap">
          <img className="rectangle" alt="Rectangle" src={imageSrc} /> {/* 상태에서 이미지 경로 사용 */}
          <h1>Signup Page</h1>
          <form onSubmit={handleSubmit}>
            <div className="group">
              <div className="view">
                <label htmlFor="username" className="div">아이디 입력</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
              </div>
              <div className="view-2">
                <label htmlFor="password" className="text-wrapper-2">비밀번호 입력</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="view-3">
                <label htmlFor="confirmPassword" className="text-wrapper-2">비밀번호 입력 확인</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
              <div className="view-4">
                <label htmlFor="fullName" className="text-wrapper-2">회원 이름 입력</label>
                <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="view-5">
                <label htmlFor="nickname" className="text-wrapper-2">사용할 닉네임 입력</label>
                <input type="text" id="nickname" name="nickname" value={formData.nickname} onChange={handleChange} required />
              </div>
              <div className="view-6">
                <label htmlFor="phone" className="text-wrapper-2">핸드폰 번호 입력</label>
                <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="view-7">
                <label className="text-wrapper-2">성별 선택</label>
                <label>
                  <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} required /> 남성
                </label>
                <label>
                  <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} required /> 여성
                </label>
              </div>
              <div className="view-8">
                <label htmlFor="email" className="text-wrapper-2">이메일 입력 (선택)</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="group-2">
                <button type="button" onClick={handleCancel} className="view-7">취소</button>
                <button type="submit" className="view-8">회원가입</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default SignupPage;
