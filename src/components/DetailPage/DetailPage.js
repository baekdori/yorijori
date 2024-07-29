import React, { useState, useEffect } from 'react'; // React와 Hook을 불러옴
import { useNavigate } from 'react-router-dom'; // 네비게이션을 위한 훅 불러옴
import './DetailPage.css'; // CSS 파일 불러옴
import axios from 'axios'; // HTTP 요청을 위한 axios 불러옴
import TopBar from '../TopBar/TopBar.js';
import BottomBar from '../BottomBar/BottomBar.js';

const DetailPage = () => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [editingText, setEditingText] = useState('');

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

  const handleEditComment = async (id) => {
    if (editingText.trim() === '') {
      return;
    }

    try {
      const response = await axios.put(`/api/comments/${id}`, { text: editingText });
      setComments(comments.map(comment => comment.id === id ? response.data : comment));
      setEditingComment(null);
      setEditingText('');
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await axios.delete(`/api/comments/${id}`);
      setComments(comments.filter(comment => comment.id !== id));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="DetailPage">
      <TopBar />
      <div className="detail-container">
        <div className="image-section">
          <h2>이미지</h2>
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
              <div key={comment.id}>
                <div>{comment.date}</div>
                <div>{comment.text}</div>
                {editingComment === comment.id ? (
                  <div>
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <button onClick={() => handleEditComment(comment.id)}>수정</button>
                    <button onClick={() => setEditingComment(null)}>취소</button>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => {
                      setEditingComment(comment.id);
                      setEditingText(comment.text);
                    }}>수정</button>
                    <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                  </div>
                )}
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

export default DetailPage;
