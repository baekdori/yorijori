import React, { useState, useEffect } from 'react'; // React와 Hook을 불러옴
import { useNavigate } from 'react-router-dom'; // 네비게이션을 위한 훅 불러옴
import './DetailPage.css'; // CSS 파일 불러옴
import axios from 'axios'; // HTTP 요청을 위한 axios 불러옴

const DetailPage = () => {
  const navigate = useNavigate(); // 네비게이션 훅 사용
  const [details, setDetails] = useState(null); // details 상태 변수와 이를 설정하는 함수 선언
  const [loading, setLoading] = useState(true); // 로딩 상태를 관리하는 상태 변수와 이를 설정하는 함수 선언

  useEffect(() => {
    // 컴포넌트가 마운트될 때 데이터를 가져오는 함수
    const fetchDetails = async () => {
      try {
        const response = await axios.get('API_URL_HERE'); // 실제 API URL로 대체해야합니다
        setDetails(response.data); // 가져온 데이터를 details 상태에 저장
        setLoading(false); // 로딩 상태를 false로 설정
      } catch (error) {
        console.error('Error fetching details:', error); // 에러가 발생하면 콘솔에 출력
        setLoading(false); // 에러가 발생해도 로딩 상태를 false로 설정
      }
    };

    fetchDetails(); // fetchDetails 함수 호출
  }, []); // 빈 배열을 의존성 배열로 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 설정

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 컴포넌트
  }

  if (!details) {
    return <div>No details available</div>; // 데이터가 없을 때 표시할 컴포넌트
  }

  return (
    <div className="detail-container"> {/* 상세 정보 컨테이너 */}
      <h1>{details.title}</h1> {/* 제목 표시 */}
      <p>{details.description}</p> {/* 설명 표시 */}
      

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
    </div>
    </div>
  );
};

export default DetailPage; // 컴포넌트를 기본 내보내기로 내보냄
