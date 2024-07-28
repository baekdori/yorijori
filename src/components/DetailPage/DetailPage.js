import React, { useState, useEffect } from 'react'; // React와 Hook을 불러옴
import { useNavigate } from 'react-router-dom'; // 네비게이션을 위한 훅 불러옴
import './DetailPage.css'; // CSS 파일 불러옴
import axios from 'axios'; // HTTP 요청을 위한 axios 불러옴
import TopBar from '../TopBar/TopBar.js';

const DetailPage = () => {
  // const navigate = useNavigate(); // 네비게이션 훅 사용
  // const [details, setDetails] = useState(null); // details 상태 변수와 이를 설정하는 함수 선언
  // const [loading, setLoading] = useState(true); // 로딩 상태를 관리하는 상태 변수와 이를 설정하는 함수 선언

  // useEffect(() => {
  //   const fetchDetails = async () => { // 데이터를 가져오는 함수
  //     try {
  //       const response = await axios.get('API_URL_HERE'); // 실제 API URL로 대체해야합니다
  //       setDetails(response.data); // 가져온 데이터를 details 상태에 저장
  //       setLoading(false); // 로딩 상태를 false로 설정
  //     } catch (error) {
  //       console.error('Error fetching details:', error); // 에러가 발생하면 콘솔에 출력
  //       setLoading(false); // 에러가 발생해도 로딩 상태를 false로 설정
  //     }
  //   };

  //   fetchDetails(); // fetchDetails 함수 호출
  // }, []); // 빈 배열을 의존성 배열로 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 설정

  // // if (loading) {
  // //   return <div>Loading...</div>; // 로딩 중일 때 표시할 컴포넌트
  // // }

  // // if (!details) {
  // //   return <div>No details available</div>; // 데이터가 없을 때 표시할 컴포넌트
  // // }

  return (
    <div className="DetailPage"> {/* 최상위 요소로 div 사용 */}
    <TopBar />
  
      <div className="detail-container"> {/* 상세 정보 컨테이너 */}
        {/* 각 섹션에 대한 자리 표시자 추가 */}
        <div className="image-section">
          <h2>이미지</h2>
          {/* <img src={details.imageURL} alt="음식 이미지" /> */}
        </div>

        <div className="title-group">
          <div className="title-section"> {/*제목 섹션으로 변경 */}
            <h2>제목</h2>
            {/* <p>{details.title}</p> */}
          </div>
          <div className="subtitle-section"> {/* 부제목 섹션 추가 */}
            <h2>부제목</h2>
            {/* <p>{details.subtitle}</p> */}
          </div>
          <div className="bookmark-section"> {/* 북마크 이미지 섹션 추가 */}
            <h2>북마크</h2>
            {/* <img src={details.bookmarkImageURL} alt="북마크 이미지" /> */}
          </div>
        </div>

        <div className="video-section">
          <h2>유튜브 영상</h2>
          
        </div>

        <div className="description-section">
          <h2>상세 설명</h2>
          {/* <p>{details.longDescription}</p> */}
        </div>

        <div className="comments-section">
          <h2>댓글</h2>
          {/* {details.comments.map((comment, index) => (
            <div key={index} className="comment">
              <p><strong>{comment.nickname}</strong> ({comment.date}):</p>
              <p>{comment.content}</p>
            </div>
          ))} */}
        </div>

        <div className="comment-input-section">
          <h2>댓글 작성</h2>
          {/* <textarea maxLength="500" placeholder="댓글을 작성하세요..."></textarea>
          <button type="button">댓글 등록</button> */}
        </div>
      </div>
    </div>
  );
};

export default DetailPage; // 컴포넌트를 기본 내보내기로 내보냄
