import React, { useState, useEffect } from 'react'; // React와 Hook을 불러옴
import { useNavigate } from 'react-router-dom'; // 네비게이션을 위한 훅 불러옴
import './DetailPage.css'; // CSS 파일 불러옴
import axios from 'axios'; // HTTP 요청을 위한 axios 불러옴
import TopBar from '../TopBar/TopBar.js';
import BottomBar from '../BottomBar/BottomBar.js';

const DetailPage = () => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {

    // 서버에서 댓글 목록을 가져옵니다.
    const fetchComments = async () => {
      try {
        const response = await axios.get('/api/comments');
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      return;
    }

    // 서버에 새로운 댓글을 추가합니다.
    try {
      const response = await axios.post('/api/comments', { text: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  


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
          <h2>Review</h2>
          <div>
            {comments.map((comment, index) => (
              <div key={index}>
                <div>{comment.date}</div>
                <div>{comment.text}</div>
              </div>
            ))}
          </div>
          
          <div>
            <textarea
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>
              등록
            </button>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};


export default DetailPage; // 컴포넌트를 기본 내보내기로 내보냄
