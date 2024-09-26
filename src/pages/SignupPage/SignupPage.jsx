import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css'; // 기존 CSS 파일 가져오기
import axios from 'axios';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: '',
    user_pw: '',
    confirmPassword: '',
    user_name: '',
    user_nick: '',
    user_phone: '',
    user_gender: '',
    user_email: ''
  });

  const [inputVisibility, setInputVisibility] = useState({
    pwVisible: false,
    pwCheckVisible: false,
    nameVisible: false,
    nickVisible: false,
    phoneVisible: false,
    genderVisible: false,
    emailVisible: false
  });

  useEffect(() => {
    if (formData.user_id) {
      setTimeout(() => setInputVisibility((prev) => ({ ...prev, pwVisible: true })), 1000);
    }
  }, [formData.user_id]);

  useEffect(() => {
    if (formData.user_pw) {
      setTimeout(() => setInputVisibility((prev) => ({ ...prev, pwCheckVisible: true })), 1000);
    }
  }, [formData.user_pw]);

  useEffect(() => {
    if (formData.confirmPassword) {
      setTimeout(() => setInputVisibility((prev) => ({ ...prev, nameVisible: true })), 1000);
    }
  }, [formData.confirmPassword]);

  useEffect(() => {
    if (formData.user_name) {
      setTimeout(() => setInputVisibility((prev) => ({ ...prev, nickVisible: true })), 1000);
    }
  }, [formData.user_name]);

  useEffect(() => {
    if (formData.user_nick) {
      setTimeout(() => setInputVisibility((prev) => ({ ...prev, phoneVisible: true })), 1000);
    }
  }, [formData.user_nick]);

  useEffect(() => {
    if (formData.user_phone) {
      setTimeout(() => setInputVisibility((prev) => ({ ...prev, genderVisible: true })), 500);
    }
  }, [formData.user_phone]);

  useEffect(() => {
    if (formData.user_gender) {
      setTimeout(() => setInputVisibility((prev) => ({ ...prev, emailVisible: true })), 1000);
    }
  }, [formData.user_gender]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.user_pw !== formData.confirmPassword) {
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
    <div>
      <div className="SignupPage_container">
        <TopBar />
        <BottomBar />
        <div className='signup_page_title'>회 원 가 입</div>
        <form onSubmit={handleSubmit}>
          <div className="group-1">
            <div className="id-input-square">
              <img className="star" alt="star" src="/static/img/xnix-line-star.png" />
              <input
                type="text"
                id="username"
                name="user_id"
                placeholder="아이디 입력"
                value={formData.user_id}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className={`pw-input-square ${inputVisibility.pwVisible ? 'visible' : ''}`}>
              <img className="star" alt="star" src="/static/img/xnix-line-star.png" />
              <input
                type="password"
                id="password"
                name="user_pw"
                placeholder="비밀번호 입력"
                value={formData.user_pw}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className={`pw-check-square ${inputVisibility.pwCheckVisible ? 'visible' : ''}`}>
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
            <div className={`name-input-square ${inputVisibility.nameVisible ? 'visible' : ''}`}>
              <img className="star" alt="star" src="/static/img/xnix-line-star.png" />
              <input
                type="text"
                id="fullName"
                name="user_name"
                placeholder="회원 이름 입력"
                value={formData.user_name}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className={`nick-input-square ${inputVisibility.nickVisible ? 'visible' : ''}`}>
              <img className="star" alt="star" src="/static/img/xnix-line-star.png" />
              <input
                type="text"
                id="nickname"
                name="user_nick"
                placeholder="사용할 닉네임 입력"
                value={formData.user_nick}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className={`phone-input-square ${inputVisibility.phoneVisible ? 'visible' : ''}`}>
              <img className="star" alt="star" src="/static/img/xnix-line-star.png" />
              <input
                type="text"
                id="phone"
                name="user_phone"
                placeholder="핸드폰 번호 입력"
                value={formData.user_phone}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className={`gender-input-radio ${inputVisibility.genderVisible ? 'visible' : ''}`}>
              <img className="star" alt="star" src="/static/img/xnix-line-star.png" style={{ marginRight: '50px' }} />
              <label className="gender-label" style={{ marginRight: '30px' }}>
                <input type="radio" name="user_gender" value="male" checked={formData.user_gender === 'male'} style={{ marginRight: '30px' }} onChange={handleChange} required />
                <img className="male" alt="male" src="/static/img/xnix-line-male.png" style={{ marginRight: '30px' }} />남성
              </label>
              <label className="gender-label" style={{ marginRight: '30px' }}>
                <input type="radio" name="user_gender" value="female" checked={formData.user_gender === 'female'} style={{ marginRight: '30px' }} onChange={handleChange} required />
                <img className="female" alt="female" src="/static/img/xnix-line-female.png" style={{ marginRight: '30px' }} />여성
              </label>
            </div>
            <div className={`email-input-square ${inputVisibility.emailVisible ? 'visible' : ''}`}>
              <input
                type="text"
                id="phone"
                name="user_email"
                placeholder="이메일 입력(선택)"
                value={formData.user_email}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="signupbtn-container">
              <button type="submit" className="SignupBtn">회원가입</button>
              <button type="button" onClick={handleCancel} className="SignupCancelBtn">취소</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
