import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../TopBar/TopBar.js';
import BottomBar from '../BottomBar/BottomBar.js';
import './DetailPage.css';

const DetailPage = () => {
  const { foodIdx } = useParams();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [description, setDescription] = useState(''); // 상세 설명을 위한 상태 추가
  const user_id = 'kws';

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

    const fetchDetails = async () => {
      try {
        const response = await axios.get('/api/details');
        setTitle(response.data.title);
        setSubtitle(response.data.subtitle);
        setVideoLink(response.data.videoLink);
        setDescription(response.data.description); // 상세 설명 설정
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchComments();
    fetchBookmarkStatus();
    fetchDetails();
  }, [user_id, foodIdx]);

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

  const comtsmodify = async (id) => {
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

  const comtsdelete = async (id) => {
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
            src="이미지_경로"
            alt="음식 이미지"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="title-group">
            <div className="title-section">
              <h2>{title}</h2>
              <p>{subtitle}</p>
              <div className="bookmark-section">
                <img
                  className="bookmark-icon"
                  src={isBookmarked ? "꽉찬_하트_이미지_경로" : "빈_하트_이미지_경로"}
                  alt="Bookmark"
                  onClick={toggleBookmark}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="video-section">
          {videoLink ? (
            <iframe
              className="video-iframe"
              src={videoLink}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video"
            ></iframe>
          ) : (
            <div className="video-placeholder">영상이 없습니다</div>
          )}
        </div>

        <div className="description-section">
          <h2>상세 설명</h2>
          <p>{description}</p>
        </div>

        <div className="comments-section">
          <h2>Review</h2>
          <hr className="review-underline" />
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
