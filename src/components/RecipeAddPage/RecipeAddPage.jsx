import React, { useState } from 'react'; // 상태관리를 위한 useState 추가
import './RecipeAddPage.css';
import BottomBar from '../BottomBar/BottomBar.jsx';
import TopBar from '../TopBar/TopBar.js';

function RecipeAddPage() {
    // 입력한 정보를 관리하기 위한 상태 저장공간
    const [desc, setDesc] = useState('');    // 음식 정의 -> 게시글 제목
    const [name, setName] = useState('');     // 음식 이름
    const [video, setVideo] = useState('');   // 음식 영상
    const [recipe, setRecipe] = useState(''); // 음식 레시피
    const [mood, setMood] = useState('');     // 음식 사용 식재료
    const [coverImage, setCoverImage] = useState('');   // 음식 대표 이미지
    const [coverImageName, setCoverImageName] = useState(''); // 대표 이미지 제목
    const [recipeImages, setRecipeImages] = useState([]);

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (e.target.files.length > 1) {
            alert('한 개의 이미지만 첨부할 수 있습니다.');
            e.target.value = ''; // 파일 선택 초기화
            return;
        }
        if (file) {
            const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/svg+xml'];
            if (!validImageTypes.includes(file.type)){
                e.target.value = ''; // 파일 선택 초기화
                return;
            }
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverImage(reader.result);
            setCoverImageName(file.name);
        };
        reader.readAsDataURL(file);
        }
    }

    const handleRemoveCoverImage = () => {
        setCoverImage('');
        setCoverImageName('');
    }

    const handleMultiImageChange = (e) =>{
        const files = Array.from(e.target.files);
        const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/svg+xml'];
        
        const newImages = files.filter(file => validImageTypes.includes(file.type)).map(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise(resolve => {
                reader.onloadend = () => {
                    resolve(reader.result);
                };
            });
        });

        Promise.all(newImages).then(images => {
            setRecipeImages(prevImages => [...prevImages, ...images]);
        });

        e.target.value = ''; // 파일 선택 초기화
    }

    // 저장 정보를 비동기화 -> 새로고침 없이 적용되게 하는 코드
    const recipeAdd = async (e) => {          // 저장 변수 이름 및 비동기 기능
        e.preventDefault();                   // 폼의 기본 제출 시 비동기 방식으로 코드 처리 -> 새로고침 없이 정보 처리

        // 비동기로 서버로 보낼 데이터 객체 생성
        const postData = {
            food_name: name,                  // 음식 이름
            food_desc: desc,                  // 음식 정의 -> 게시글 제목
            food_video: video,                // 음식 영상
            food_recipe: recipe,              // 음식 레시피
            food_mood: mood,                  // 음식 사용 식재료
            ingre_img: coverImage                  // 음식 이미지
        };

        try {
            // 서버 통신
            // 서버로 POST 요청 보내기
            const response = await fetch('http://localhost:4000/foods/postcreat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // 요청 헤더에 JSON 형식 명시
                },
                body: JSON.stringify(postData) // 요청 본문에 JSON 데이터 추가
            });

            // 응답 처리
            if (response.ok) {
                alert('레시피가 성공적으로 등록되었습니다.'); // 성공 시 알림
                // 폼 초기화
                setName('');
                setDesc('');
                setVideo('');
                setRecipe('');
                setMood('');
                setCoverImage('');
            } else {
                alert('레시피 등록에 실패했습니다.'); // 실패 시 알림
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버와의 통신 중 오류가 발생했습니다.'); // 통신 오류 시 알림
        }
    };

    return (
        <div className="recipe-add-page">
            <TopBar />
            <h1 className="recipe-title">레시피 작성</h1>
            <div className="first-line"></div>
            <form onSubmit={recipeAdd}> {/* 저장 정보를 제출 */}
                <div className="title-container">
                    <input type="text" className="title-input" placeholder="제목 작성" />
                    <input type="text" className="recipe-comment-input" placeholder="음식에 대한 간단한 설명을 작성해주세요" />
                    <label htmlFor="firstImg" className="custom-file-upload">대표 이미지 선택</label>
                    <input id="firstImg" type="file" accept="image/*" className="firstImg-input" onChange={handleCoverImageChange} />
                    <span className="image-name">{coverImageName}</span> {/* 이미지 파일 이름 표시 */}
                </div>
                {coverImage && (
                    <div className="image-preview">
                        <img src={coverImage} className="preview-img" />
                        <button type='button' className='remove-coverimg-btn' onClick={handleRemoveCoverImage}>X</button>
                    </div>
                )}
                <div className="second-line"></div>
                <label htmlFor="secondImg" className="recipepic-upload">이미지 선택</label>
                <input id="secondImg"type="file" accept = "image/*" className = "secondImg-input" onChange={handleMultiImageChange}/>
                <div className="multi-images-container">
                    
                    {recipeImages.map((img, index) => (
                        <img key={index} src={img} className="multi-imgs-preview" />
                    ))}
                </div>
                <textarea className="recipe-input" placeholder="본문 내용을 입력하세요"></textarea>
                <div className="button-container">
                    <button type="button" className="cancel-btn-r">취소</button>
                    <button type="submit" className="submit-btn-r">등록</button>
                </div>
            </form>
            <BottomBar />
        </div>
    );
}

export default RecipeAddPage;
