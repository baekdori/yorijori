import axios from 'axios'; // npm install axios 필요
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import TopBar from '../../components/TopBar/TopBar';
import BottomBar from '../../components/BottomBar/BottomBar';


const LoginPage = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옴
  const [formData, setFormData] = useState({  // 상태 관리
    username: '',
    password: ''
  });

  const [idInputFocused, setIdInputFocused] = useState(false); // id-input 칸 색상 변경 상태
  const [pwInputFocused, setPwInputFocused] = useState(false); // pw-input 칸 색상 변경 상태  
  const [idHasText, setIdHasText] = useState(false); // 문자열이 입력된 상태
  const [pwHasText, setPwHasText] = useState(false); // 문자열이 입력된 상태 

  // 입력 값 변경을 처리하는 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`입력 값 변경 - ${name}: ${value}`); // 입력 값 변경 출력
    setFormData({
      ...formData,
      [name]: value
    });
     // input 칸에 문자열이 있는지 확인하여 상태 설정
    if (name === 'user_id'){
      setIdHasText(value.length > 0); // user_id에 문자열이 있으면 true, 없으면 false
    } else if (name === 'user_pw'){
      setPwHasText(value.length > 0); // user_pw에 문자열이 있으면 true, 없으면 false
    }
  };

  // 로그인 처리 함수 (API 호출)
  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출의 기본 동작인 페이지 리로드 방지
    console.log('로그인 시도:', formData);
    try {
      const response = await axios.post("http://localhost:4000/user/login", formData);  // axios를 사용하여 백엔드 서버로 POST 요청 보냄
      console.log('서버에서 응답한 값', response.data); // 서버 응답 출력
      // 서버에서 응답 받은 값의 user 키에 값이 존재하면? 로그인 된거임 / 없으면? 로그인 안된거임 

      if (response.status === 200) {
        alert('로그인 성공');

        // 브라우저 내 세션 저장하는 방법 : sessionStorage(키,값)
        sessionStorage.setItem('user', response.data.user)


        // navigate('/'); /// 로그인 성공 시 메인 페이지로 이동
        window.location.href="/" // 새로고침을 하면서 이동 -> 새로고침을 하는 이유? 로그인으로 인해 값이 변경되었으므로 페이지 업데이트가 필요함. 

      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('로그인 도중 오류 발생');   // 네트워크 오류 등의 예외상황을 catch 블록에서 처리하여 오류메세지 표시
    }
  };

  // 회원가입 페이지로 이동하는 함수
  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    
    <div>

      <div className="login_page_container">
      <TopBar />
      <div className='login_page_title'>로그인</div>
      
      <form>
        <div className="group">
          <div className={`id-input ${idInputFocused || idHasText ? 'focused' : ''}`} >
          <img className="loginuser" alt="loginuser" src="/static/img/loginuser.png" />
            <input
              type="text"
              id="user_id"
              name="user_id"
              placeholder="아이디 입력"
              value={formData.user_id}
              onChange={handleChange}
              onFocus={() => setIdInputFocused(true)} // input 클릭 시 테두리 색상 전환
              onBlur={() => setIdInputFocused(false)} // 클릭 해제 시 테두리 색상 전환
              required
              className="input-field-id"
            />
          </div>

          <div className={`pw-input ${pwInputFocused || pwHasText ? 'focused' : ''}`}
               style={{opacity : idHasText ? 1 : 0, pointerEvents : idHasText ? 'auto' : 'none'}}>
          <img className="lock" alt="lock" src="/static/img/lock.png" />
            <input
              type="password"
              id="user_pw"
              name="user_pw"
              placeholder="비밀번호 입력"
              value={formData.user_pw}
              onChange={handleChange}
              onFocus={() => setPwInputFocused(true)}
              onBlur={() => setPwInputFocused(false)}
              required
              className="input-field-pw"
            />
          </div>

          <div className="options"
               >
            <label>
              <input type="checkbox" name="remember" />
              아이디 저장
            </label>
            <div className="links">
            <a href="/find-id" className="link">아이디 찾기</a>
            <span className="divider">|</span>
            <a href="/find-password" className="link">비밀번호 찾기</a>
            </div>
          </div>
          <div className='login-signin-buttons-assembly'>
          <button type="submit" onClick={handleLogin} className="login-submit-btn"
                  style={{opacity : pwHasText ? 1 : 0, pointerEvents : pwHasText ? 'auto' : 'none'}}>로그인</button>
          <button type="button" onClick={handleSignup} className="signin-btn">회원가입</button>
          </div>
        </div>
      </form>

    <BottomBar />
    </div>

    </div>
  );
};

export default LoginPage;
