import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // useParams import
import axios from 'axios';
import TopBar from '../TopBar/TopBar.js';
import BottomBar from '../BottomBar/BottomBar.js';
import './DetailPage.css';

const DetailPage = () => {
  // URL 파라미터에서 foodIdx를 가져옴
  const { foodIdx } = useParams();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const user_id = 'kws'; // 현재는 임의 아이디로 설정 -> 추후에 세션에서 받은 로그인 아이디로 변경되게

  // 페이지 렌더링 시 댓글과 북마크 상태 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('/api/comments');
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const fetchBookmarkStatus = async () => {
      try {
        const response = await axios.get('http://localhost:4000/favorites/status', {
          params: { user_id, foodIdx }
        });
        setIsBookmarked(response.data.isBookmarked);
      } catch (error) {
        console.error('Error fetching bookmark status:', error);
      }
    };

    fetchComments();
    fetchBookmarkStatus();
  }, [user_id, foodIdx]);

  // 댓글 등록 기능
  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      return;
    }

    try {
      const response = await axios.post('/api/comments', { text: newComment, user_id });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // 댓글 수정
  const comtsmodify = async (id) => {
    // 댓글 문제 없이 가져오기
    if (editingText.trim() === '') {
      return;
    }
    const commentToEdit = comments.find(comment => comment.id === id);
    if (commentToEdit.user_id !== user_id) {
      alert('본인의 댓글만 수정할 수 있습니다.');
      return;
    }

    try {
      const comments_idx = id;
      const udptmodify = {
        comment_text: editingText,
        food_emotion: 'null',
        user_id
      };

      const response = await fetch(`http://localhost:4000/comts/comtsmodify?comments_idx=${comments_idx}&user_id=${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(udptmodify)
      });

      if (!response.ok) {
        throw new Error('정보를 수정할 수 없습니다.');
      }

      const data = await response.json();
      setComments(comments.map(comment => comment.id === id ? data : comment));
      setEditingComment(null);
      setEditingText('');
    } catch (error) {
      console.error('에러 발생:', error);
      alert('정보를 수정할 수 없습니다.');
    }
  };

  // 댓글 삭제
  const comtsdelete = async (id) => {
    // 문장을 비교해보고 본인 댓글만 삭제
    const commentToDelete = comments.find(comment => comment.id === id);
    if (commentToDelete.user_id !== user_id) {
      alert('본인의 댓글만 삭제할 수 있습니다.');
      return;
    }

    try {
      const comments_idx = id;

      const response = await fetch(`http://localhost:4000/comts/comtsdelete?comments_idx=${comments_idx}&user_id=${user_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('정보를 삭제할 수 없습니다.');
      }
      const data = await response.json();
      console.log('게시글 삭제 응답:', data);

      setComments(comments.filter(comment => comment.id !== id));
    } catch (error) {
      console.error('에러 발생:', error);
      alert('정보를 삭제할 수 없습니다.');
    }
  };

  // 즐겨찾기 토글 기능
  const toggleBookmark = async () => {
    try {
      const url = isBookmarked
        ? 'http://localhost:4000/favorites/remove'
        : 'http://localhost:4000/favorites/add';

      const response = await axios.post(url, {
        user_id,
        foodIdx
      });

      if (!response.data.success) {
        throw new Error(isBookmarked ? '북마크를 제거할 수 없습니다.' : '북마크를 추가할 수 없습니다.');
      }

      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('북마크 토글 오류:', error);
      alert('북마크 상태를 변경할 수 없습니다.');
    }
  };

  return (
    <div className="DetailPage">
      <TopBar />
      <div className="detail-container">
        <div className={`image-section ${imageLoaded ? 'image-loaded' : ''}`}>
          {!imageLoaded && <div className="image-placeholder">사진</div>}
          <img
            src="이미지_경로" // 서버에서 가져올 이미지 경로
            alt="음식 이미지"
            onLoad={() => setImageLoaded(true)} // 이미지 로드 완료 시 상태 업데이트
          />
        </div>

        <div className="title-group">
          <div className="title-section">
            <h2>제목</h2>
          </div>
          <div className="subtitle-section">
            <h2>부제목</h2>
          </div>
          <div className="bookmark-section">
            <h2>북마크</h2>
            <button onClick={toggleBookmark}>
              {isBookmarked ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            </button>
          </div>
        </div>

        <div className="video-section">
          <h2>유튜브 영상</h2>
        </div>

        <div className="description-section">
          <h2>상세 설명</h2>
        </div>

        <div className="comments-section">
          <h2>Review</h2>
          <div>
            {comments.map((comment) => (
              <div key={comment.id} className="comment-box">
                <div className="comment-header">
                  <span>{comment.nickname}</span>
                  <span>{comment.date}</span>
                </div>
                <div className="comment-content">
                  {comment.text}
                </div>
                {editingComment === comment.id ? (
                  <div>
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <button onClick={() => comtsmodify(comment.id)}>수정</button>
                    <button onClick={() => setEditingComment(null)}>취소</button>
                  </div>
                ) : (
                  <div className="comment-actions">
                    <button onClick={() => {
                      setEditingComment(comment.id);
                      setEditingText(comment.text);
                    }}>수정</button>
                    <button onClick={() => comtsdelete(comment.id)}>삭제</button>
                  </div>
                )}
              </div>
            ))}
          </div>


          <div className="comment-input-container">
            <textarea
              className="comment-input"
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="comment-button" onClick={handleAddComment}>
              등록
            </button>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
};

export default DetailPage;
