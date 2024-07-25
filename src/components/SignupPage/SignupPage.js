import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XnixLineSearch4 } from '../static/icons/XnixLineSearch4'; // 상대 경로가 올바른지 확인
import './SignupPage.css'; // 기존 CSS 파일 가져오기
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
      console.log('회원가입 시도:', formData);
      const response = await axios.post("http://localhost:4000/user/signup", formData);
      console.log('서버 응답:', response);
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
        {/* 맨위에 올라가는 로고와 알림, 돋보기, 더보기칸 아이콘 */}
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




        <h1>회 원 가 입</h1>
        <form onSubmit={handleSubmit}>
          <div className="group">

            <div className="view">
            <img className="star" alt="star" src="/static/img/xnix-line-star.png" />
              <input
                type="text"
                id="username"
                name="user_name"
                placeholder="아이디 입력"
                value={formData.username}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="view-2">
            <img className="star" alt="star" src="/static/img/xnix-line-star.png" />
              <input
                type="password"
                id="password"
                name="user_pw"
                placeholder="비밀번호 입력"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="view-3">
            <img className="star" alt="star" src="/static/img/xnix-line-star.png" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="비밀번호 입력 확인"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="view-4">
            <img className="star" alt="star" src="/static/img/xnix-line-star.png" />
              <input
                type="text"
                id="fullName"
                name="user_name"
                placeholder="회원 이름 입력"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="view-5">
            <img className="star" alt="star" src="/static/img/xnix-line-star.png" />
              <input
                type="text"
                id="nickname"
                name="user_nick"
                placeholder="사용할 닉네임 입력"
                value={formData.nickname}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="view-6">
            <img className="star" alt="star" src="/static/img/xnix-line-star.png" />
              <input
                type="text"
                id="phone"
                name="user_phone"
                placeholder="핸드폰 번호 입력"
                value={formData.phone}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="view-7">
            <img className="star" alt="star" src="/static/img/xnix-line-star.png" />
              <label className="gender-label">
                <input type="radio" name="user_gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} required />
                <img className="male" alt="male" src="/static/img/xnix-line-male.png" />남성
              </label>
              <label className="gender-label">
                <input type="radio" name="user_gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} required /> 
                <img className="female" alt="female" src="/static/img/xnix-line-female.png" />여성
              </label>
            </div>

            <div className="view-8">
              <input
                type="text"
                id="phone"
                name="user_email"
                placeholder="이메일 입력(선택)"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="group-2">
              <button type="submit" className="view-10">회원가입</button>
              <button type="button" onClick={handleCancel} className="view-9">취소</button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};


export default SignupPage;
