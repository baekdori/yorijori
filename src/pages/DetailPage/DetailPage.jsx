// DetailPage.jsx
import React, { useState, useEffect } from 'react'; // React에서 useState와 useEffect 훅을 불러옴
import { useLocation, useParams } from 'react-router-dom'; // URL 매개변수를 가져오기 위해 useParams 훅을 불러옴
import axios from 'axios'; // HTTP 요청을 보내기 위해 axios 라이브러리를 불러옴
import TopBar from '../../components/TopBar/TopBar'; // 상단 바 컴포넌트를 불러옴
import BottomBar from '../../components/BottomBar/BottomBar'; // 하단 바 컴포넌트를 불러옴
import './DetailPage.css'; // 해당 컴포넌트의 스타일링을 위한 CSS 파일을 불러옴

// DetailPage 컴포넌트 정의, props로 result를 받음
const DetailPage = ({ result }) => {
  const { food_idx } = useParams(); // URL에서 foodIdx 값을 가져옴
  const location = useLocation();
  const [newComment, setNewComment] = useState(''); // 새로운 댓글을 위한 상태 정의
  const [comments, setComments] = useState([]); // 댓글 목록을 관리하기 위한 상태 정의
  const [editingComment, setEditingComment] = useState(null); // 수정 중인 댓글을 추적하기 위한 상태 정의
  const [editingText, setEditingText] = useState(''); // 수정할 댓글의 내용을 관리하는 상태 정의
  const [imageLoaded, setImageLoaded] = useState(false); // 이미지 로딩 상태를 관리하는 상태 정의
  const [isBookmarked, setIsBookmarked] = useState(false); // 북마크 상태를 관리하는 상태 정의
  const [title, setTitle] = useState(''); // 상세 페이지 제목을 관리하는 상태 정의
  const [subtitle, setSubtitle] = useState(''); // 상세 페이지 부제목을 관리하는 상태 정의
  const [description, setDescription] = useState(''); // 상세 설명을 위한 상태 정의

  const foodName = result.food_name;
  const seUser = sessionStorage.getItem('user'); // 세션 스토리지에서 유저 아이디를 가져옴
  console.log('디테일에서 확인한 세션아이디 저장값', seUser, foodName);
  

  const user_id = seUser; // 가져온 유저 아이디를 변수로 저장

  const filledHeart = process.env.PUBLIC_URL + '/static/img/red heart_filled.png'; // 북마크가 된 상태의 하트 이미지 경로
  const emptyHeart = process.env.PUBLIC_URL + '/static/img/red heart.png'; // 북마크가 안 된 상태의 하트 이미지 경로

  useEffect(() => { // 컴포넌트가 렌더링될 때와 foodIdx, user_id가 변경될 때 실행
    console.log('DetailPage에서 받은 결과:', result); // result 값 확인

    const fdid = food_idx; // result에서 food_idx를 가져옴
    
    console.log('food_idx : ',fdid,fdnm);
    

    // 1. 댓글 데이터를 가져오는 함수
    const getcomts = async () => {
      try {
        // API 요청으로 댓글 데이터 가져오기
        const response = await fetch(`http://localhost:4000/comts/comtssee?food_idx=${fdid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('정보를 불러올 수 없습니다.');
        }
        const cmdata = await response.json(); // 댓글 데이터를 JSON 형태로 파싱
        console.log('댓글 데이터 : ', cmdata);

        setComments(cmdata); // 가져온 댓글 데이터를 상태로 설정
      } catch (error) {
        console.error('에러 발생', error);
        alert('정보를 불러올 수 없습니다.');
      }
    };

    // 2. 북마크 상태를 가져오는 함수
    const fetchBookmarkStatus = async () => {
      const fdid = result.food_idx; // result에서 food_idx를 가져옴
      try {
        const response = await axios.get('http://localhost:4000/favorites/check', {
          params: { user_Id : user_id, food_idx: fdid } // user_id와 foodIdx를 쿼리 파라미터로 전달
        });
        setIsBookmarked(response.data.isBookmarked); // 북마크 상태를 설정
      } catch (error) {
        console.error('북마크 상태 확인 오류 : ', error);
      }
    };

     // 3. 상세 정보를 가져오는 함수
     const fetchDetails = async () => {
      if (!fdid) { // fdid가 undefined이면 실행하지 않음
        console.error('food_idx is undefined');
        return;
      }
      try {
        const response = await axios.get(`/api/details?foodIdx=${fdid}`);
        setTitle(response.data.title);
        setSubtitle(response.data.subtitle);
        setDescription(response.data.description);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchBookmarkStatus(); // 북마크 상태를 가져오는 함수 실행
    fetchDetails(); // 상세 정보를 가져오는 함수 실행
    getcomts(); // 댓글 데이터를 가져오는 함수 실행
  }, [user_id, food_idx]); // 의존성 배열에 user_id와 foodIdx를 지정하여 해당 값이 변경될 때마다 useEffect 실행
  
  // // FavoritePage에서 받은 데이터 출력
  // useEffect(() => {
  //   if (location.state && location.state.foodDetails) {
  //     console.log('FavoritePage에서 전달받은 데이터:', location.state.foodDetails);
  //     // 여기서 데이터를 처리하여 원하는 대로 상태를 설정하거나 출력할 수 있습니다.
  //     const foodDetails = location.state.foodDetails;
  //     setTitle(foodDetails.food_name);
  //     setSubtitle(foodDetails.food_mood); // 필요한 데이터를 상태로 설정
  //     setDescription(foodDetails.food_desc); // 또는 다른 필드에 맞게 설정
  //   }
  // }, [location.state]);

  // 댓글 삭제 함수
  const delcomts = async (comments_idx) => {
    try {
      const response = await fetch(`http://localhost:4000/comts/comtsdelete?comments_idx=${comments_idx}&user_id=${user_id}`, {
        method: 'DELETE', // DELETE 요청을 사용하여 댓글 삭제
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('정보를 삭제할 수 없습니다.');
      }
      const data = await response.json(); // 삭제 응답 데이터를 JSON으로 파싱
      console.log('게시글 삭제 응답:', data);
      setComments(comments.filter(comment => comment.comments_idx !== comments_idx)); // 상태에서 삭제된 댓글 제거
    } catch (error) {
      console.error('에러 발생:', error);
      alert('정보를 삭제할 수 없습니다.');
    }
  };

  // 댓글 수정 함수
  const mocomts = async (comments_idx) => {
    try {
      const updatedComment = {
        comment_text: editingText, // 수정된 댓글 텍스트
        user_id: user_id // 유저 아이디
      };

      console.log('수정하는 데이터:', updatedComment); // 수정할 데이터 콘솔 출력

      const response = await fetch(`http://localhost:4000/comts/comtsmodify?comments_idx=${comments_idx}&user_id=${user_id}`, {
        method: 'PUT', // PUT 요청을 사용하여 댓글 수정
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedComment) // 수정된 데이터를 JSON 문자열로 변환하여 전송
      });

      if (!response.ok) {
        throw new Error('정보를 수정할 수 없습니다.');
      }

      const data = await response.json(); // 수정 응답 데이터를 JSON으로 파싱
      console.log('댓글 수정 응답:', data);

      setComments(comments.map(comment =>
        comment.comments_idx === comments_idx ? { ...comment, comment_text: editingText } : comment
      )); // 상태에서 해당 댓글의 텍스트 업데이트

      setEditingComment(null); // 수정 상태 초기화
      setEditingText(''); // 수정 텍스트 초기화
    } catch (error) {
      console.error('에러 발생:', error);
      alert('정보를 수정할 수 없습니다.');
    }
  };

  // 댓글 추가 함수
  const handleAddComment = async () => {
    if (newComment.trim() === '') { // 새로운 댓글이 비어 있는지 확인
      return; // 비어 있으면 함수를 종료하여 아무 작업도 하지 않음
    }

    try {
      const response = await axios.post('/api/comments', { text: newComment, user_id }); // 새로운 댓글을 추가하는 API 요청
      setComments([...comments, response.data]); // 상태에 새로운 댓글을 추가
      setNewComment(''); // 댓글 입력 필드를 초기화
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // 좋아요/싫어요 기능
const handleLike = async (comment_id) => {
  try {
      await axios.post('/api/reactions/like', { comment_id, user_id });
      // 좋아요 취소할 때는 별도의 함수로 호출
  } catch (error) {
      console.error(error.response.data.message);
  }
};

const handleDislike = async (comment_id) => {
  try {
      await axios.post('/api/reactions/dislike', { comment_id, user_id });
  } catch (error) {
      console.error(error.response.data.message);
  }
};

  // 북마크 토글 함수
  const toggleBookmark = async () => {
    const fdid = result.food_idx; // 반환된 결과에서 food_idx를 가져옴
    const foodName = result.food_name;     // 음식 이름
    try {
      if (isBookmarked) {
        await axios.post('http://localhost:4000/favorites/remove', {
          user_Id : user_id,
          food_idx : fdid,
          food_name : foodName
        });
      } else {
        await axios.post('http://localhost:4000/favorites/add', {
          user_Id : user_id,
          food_idx : fdid,
          food_name : foodName
        });
      }

      // 상태 업데이트 : 북마크 추가/제거
      setIsBookmarked(!isBookmarked); // 북마크 상태를 토글

    } catch (error) {
      console.error('북마크 토글 오류:', error);
      alert('북마크 상태를 변경할 수 없습니다.');
    }
  };

  // 음식 데이터에서 필요한 정보를 추출하여 변수로 저장
  const fdnm = result.food_name;     // 음식 이름
  const fdvd = "https://www.youtube.com/embed/0gMdr8U4Ruo"; // 음식 관련 YouTube 영상
  const fdds = result.food_desc;     // 음식 설명
  const fdrp = result.food_recipe;   // 음식 레시피
  const fdim = result.ingre_img;     // 음식 이미지

  console.log('댓글정보:', comments); // 현재 댓글 정보 출력

  return ( // 컴포넌트의 JSX 반환
    <div className="DetailPage">
      <TopBar /> {/* 상단 바 컴포넌트 */}
      <div className="detail-container">
        <div className={`image-section ${imageLoaded ? 'image-loaded' : ''}`}>
          <img
            className="DakGalbi"
            alt="DakGalbi"
            src='/static/img/DakGalbi.jpg'
          />
          <div className="title-group">
            <div className="title-section">
              <h2>{fdnm}</h2> {/* 음식 이름 */}
              <p>{fdds}</p> {/* 음식 설명 */}
            </div>
          </div>
        </div>
        <div className="bookmark-section">
          <img
            className="bookmark-icon"
            src={isBookmarked ? filledHeart : emptyHeart} // 북마크 상태에 따라 다른 하트 이미지 표시
            alt="Bookmark"
            onClick={toggleBookmark} // 클릭 시 북마크 토글 함수 호출
            onError={(e) => console.error('이미지 로드 실패:', e)} // 이미지 로드 실패 시 오류 처리
          />
        </div>

        <div className="video-section">
          {fdvd ? (
            <iframe
              className="video-iframe"
              src={fdvd}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video"
            ></iframe>
          ) : (
            <div className="video-placeholder">영상이 없습니다</div> // 영상이 없을 경우의 대체 텍스트
          )}
        </div>

        <div className="description-section">
          <h2>상세 설명</h2>
          <div dangerouslySetInnerHTML={{ __html: fdrp }} /> {/* 레시피를 HTML로 렌더링 */}
        </div>

        <div className="comments-section">
          <h2>Review</h2>
          <hr className="review-underline" />
          <div>
            {comments.map((comment) => ( // 댓글 목록을 렌더링
              <div key={comment.id} className="comment-box">
                <div className="comment-header">
                  <span>{comment.user_id}</span> {/* 댓글 작성자 아이디 */}
                </div>
                <div className="comment-content">
                  {comment.comment_text} {/* 댓글 내용 */}
                </div>
                {comment.user_id === user_id && ( // 현재 유저가 댓글 작성자일 때만 수정/삭제 버튼 표시
                  editingComment === comment.id ? ( // 수정 중인 댓글과 현재 댓글이 일치하는지 확인
                    <div>
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        placeholder="내용을 입력해주세요"
                      />
                      <button onClick={() => mocomts(comment.comments_idx)}>수정</button> {/* 수정 버튼 */}
                      <button onClick={() => {
                        setEditingComment(null);
                        setEditingText('');
                      }}>취소</button> {/* 취소 버튼 */}
                    </div>
                  ) : (
                    <div className="comment-actions">
                      <button
                  className={`like-button ${comment.like_status ? 'active' : ''}`}
                  onClick={() => handleLike(comment.id)}
                  disabled={comment.like_status}
                >
                  👍 {comment.like_count}
                </button>
                <button
                  className={`dislike-button ${comment.dislike_status ? 'active' : ''}`}
                  onClick={() => handleDislike(comment.id)}
                  disabled={comment.dislike_status}
                >
                  👎 {comment.dislike_count}
                </button>
                      <button onClick={() => {
                        setEditingComment(comment.id);
                        setEditingText('');
                      }}>
                        수정 {/* 수정 버튼 */}
                      </button>
                      <button onClick={() => delcomts(comment.comments_idx)}>삭제</button> {/* 삭제 버튼 */}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>

          <div className="comment-input-container">
            <textarea
              className="comment-input"
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)} // 새로운 댓글 입력 값 설정
            />
            <button className="comment-button" onClick={handleAddComment}>
              등록 {/* 등록 버튼 */}
            </button>
          </div>
        </div>
      </div>
      <BottomBar /> {/* 하단 바 컴포넌트 */}
    </div>
  );
};

export default DetailPage; // 컴포넌트를 모듈로 내보냄