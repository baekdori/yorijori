import React, { useState, useRef, useEffect } from 'react'; // React에서 필요한 훅들을 가져옴 (상태 관리, 참조, 부수 효과 처리)
import './RecipeAddPage.css'; // 스타일시트를 불러옴
import BottomBar from '../../components/BottomBar/BottomBar'; // 하단 바 컴포넌트를 불러옴
import TopBar from '../../components/TopBar/TopBar'; // 상단 바 컴포넌트를 불러옴

function RecipeAddPage() {
    // 입력한 정보를 관리하기 위한 상태 저장 공간
    const [desc, setDesc] = useState(''); // 음식 정의(게시글 제목)를 저장하는 상태 변수
    const [name, setName] = useState(''); // 음식 이름을 저장하는 상태 변수
    const [video, setVideo] = useState(''); // 음식 영상을 저장하는 상태 변수
    const [recipe, setRecipe] = useState(''); // 음식 레시피를 저장하는 상태 변수
    const [mood, setMood] = useState(''); // 음식 사용 식재료를 저장하는 상태 변수
    const [coverImage, setCoverImage] = useState(''); // 음식 대표 이미지를 저장하는 상태 변수
    const [coverImageName, setCoverImageName] = useState(''); // 대표 이미지 파일명을 저장하는 상태 변수
    const [recipeImages, setRecipeImages] = useState([]); // 여러 레시피 이미지를 저장하는 상태 변수

    const recipeInputRef = useRef(null); // useRef로 textarea 요소를 참조하여 직접 DOM 조작에 사용

    const handleCoverImageChange = (e) => { // 대표 이미지가 변경되었을 때 실행되는 함수
        const file = e.target.files[0]; // 사용자가 선택한 첫 번째 파일을 가져옴
        if (e.target.files.length > 1) { // 파일이 여러 개 선택된 경우
            alert('한 개의 이미지만 첨부할 수 있습니다.'); // 경고 메시지 출력
            e.target.value = ''; // 파일 선택 초기화
            return;
        }
        if (file) { // 파일이 존재하면
            const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/svg+xml']; // 유효한 이미지 타입 목록
            if (!validImageTypes.includes(file.type)){ // 파일 타입이 유효하지 않은 경우
                e.target.value = ''; // 파일 선택 초기화
                return;
            }
        
        const reader = new FileReader(); // FileReader 객체 생성
        reader.onloadend = () => { // 파일 읽기가 완료되면 실행
            setCoverImage(reader.result); // 이미지 데이터를 상태로 설정
            setCoverImageName(file.name); // 파일명을 상태로 설정
        };
        reader.readAsDataURL(file); // 파일을 Data URL로 읽음
        }
    }

    const handleRemoveCoverImage = () => { // 대표 이미지를 제거하는 함수
        setCoverImage(''); // 대표 이미지 상태 초기화
        setCoverImageName(''); // 대표 이미지 파일명 상태 초기화
    }

    const handleMultiImageChange = (e) =>{ // 여러 레시피 이미지를 선택했을 때 실행되는 함수
        const files = Array.from(e.target.files); // 선택된 파일들을 배열로 변환
        const validImageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/svg+xml']; // 유효한 이미지 타입 목록
        
        const newImages = files.filter(file => validImageTypes.includes(file.type)).map(file => { // 유효한 이미지들만 필터링하고 비동기로 처리
            const reader = new FileReader(); // FileReader 객체 생성
            reader.readAsDataURL(file); // 파일을 Data URL로 읽음
            return new Promise(resolve => {
                reader.onloadend = () => { // 파일 읽기가 완료되면 실행
                    resolve(reader.result); // 읽은 결과를 반환
                };
            });
        });

        Promise.all(newImages).then(images => { // 모든 이미지 읽기가 완료되면 실행
            setRecipeImages(prevImages => [...prevImages, ...images]); // 기존 이미지에 새 이미지를 추가하여 상태를 업데이트
        });

        e.target.value = ''; // 파일 선택 초기화
    }

    // 저장 정보를 비동기 처리하여 새로고침 없이 적용되게 하는 함수
    const recipeAdd = async (e) => { // 폼 제출 시 실행되는 비동기 함수
        e.preventDefault(); // 폼의 기본 제출 동작(새로고침)을 막음

        // 서버로 보낼 데이터 객체 생성
        const postData = {
            food_name: name, // 음식 이름
            food_desc: desc, // 음식 정의(게시글 제목)
            food_video: video, // 음식 영상
            food_recipe: recipe, // 음식 레시피
            food_mood: mood, // 음식 사용 식재료
            ingre_img: coverImage // 음식 대표 이미지
        };

        try {
            // 서버에 POST 요청 보내기
            const response = await fetch('http://localhost:4000/foods/postcreat', {
                method: 'POST', // HTTP 메서드로 POST 사용
                headers: {
                    'Content-Type': 'application/json' // 요청 헤더에 JSON 형식 명시
                },
                body: JSON.stringify(postData) // 요청 본문에 JSON으로 변환된 데이터 추가
            });

            // 응답 처리
            if (response.ok) { // 서버 응답이 성공적일 경우
                alert('레시피가 성공적으로 등록되었습니다.'); // 성공 메시지 출력
                // 입력된 폼 데이터 초기화
                setName('');
                setDesc('');
                setVideo('');
                setRecipe('');
                setMood('');
                setCoverImage('');
            } else { // 서버 응답이 실패한 경우
                alert('레시피 등록에 실패했습니다.'); // 실패 메시지 출력
            }
        } catch (error) { // 요청 중 오류가 발생한 경우
            console.error('Error:', error); // 오류 로그 출력
            alert('서버와의 통신 중 오류가 발생했습니다.'); // 통신 오류 메시지 출력
        }
    };

    useEffect(() => { // 컴포넌트가 렌더링될 때와 recipe 상태가 변경될 때 실행
        const textarea = recipeInputRef.current; // textarea 요소 참조
        if (textarea) { // 참조가 유효할 경우
            textarea.style.height = 'auto'; // 높이를 자동으로 설정하여 초기화
            textarea.style.height = `${textarea.scrollHeight}px`; // 스크롤 높이에 맞게 높이 조정
        }
    }, [recipe]); // 의존성 배열에 recipe를 추가하여 해당 값이 변경될 때마다 실행

    const handleRecipeChange = (e) => { // 레시피 내용이 변경될 때 실행되는 함수
        setRecipe(e.target.value); // 입력된 값을 recipe 상태로 설정
    };

    return (
        <div className="recipe-add-page">
            <TopBar /> {/* 상단 바 컴포넌트 */}
            <h1 className="recipe-title">레시피 작성</h1>
            <div className="first-line"></div>
            <form onSubmit={recipeAdd}> {/* 폼 제출 시 recipeAdd 함수 실행 */}
                <div className="title-container">
                    <input type="text" className="title-input" placeholder="제목 작성" /> {/* 제목 입력란 */}
                    <input type="text" className="recipe-comment-input" placeholder="음식에 대한 간단한 설명을 작성해주세요" /> {/* 설명 입력란 */}
                    <label htmlFor="firstImg" className="custom-file-upload">대표 이미지 선택</label> {/* 대표 이미지 선택 버튼 */}
                    <input id="firstImg" type="file" accept="image/*" className="firstImg-input" onChange={handleCoverImageChange} /> {/* 파일 선택 입력란 */}
                    <span className="image-name">{coverImageName}</span> {/* 이미지 파일 이름 표시 */}
                </div>
                {coverImage && ( // 대표 이미지가 선택된 경우에만 실행
                    <div className="image-preview">
                        <img src={coverImage} className="preview-img" /> {/* 선택된 대표 이미지 미리보기 */}
                        <button type='button' className='remove-coverimg-btn' onClick={handleRemoveCoverImage}>X</button> {/* 대표 이미지 제거 버튼 */}
                    </div>
                )}
                <div className="second-line"></div>
                <label htmlFor="secondImg" className="recipepic-upload">이미지 선택</label> {/* 여러 이미지 선택 버튼 */}
                <input id="secondImg" type="file" accept="image/*" className="secondImg-input" onChange={handleMultiImageChange} /> {/* 여러 이미지 파일 선택 입력란 */}
                <div className="multi-images-container">
                    {recipeImages.map((img, index) => ( // 선택된 여러 이미지 미리보기
                        <img key={index} src={img} className="multi-imgs-preview" /> // 이미지 미리보기
                    ))}
                </div>
                <textarea 
                    ref={recipeInputRef} // textarea 요소 참조
                    className="recipe-input" 
                    placeholder="본문 내용을 입력하세요" 
                    value={recipe} // recipe 상태를 값으로 설정
                    onChange={handleRecipeChange} // 값이 변경될 때 handleRecipeChange 함수 실행
                    rows={1} // 초기 표시 행 수
                ></textarea>
                <div className="button-container">
                    <button type="button" className="cancel-btn-r">취소</button> {/* 취소 버튼 */}
                    <button type="submit" className="submit-btn-r">등록</button> {/* 등록 버튼 */}
                </div>
            </form>
            <BottomBar /> {/* 하단 바 컴포넌트 */}
        </div>
    );
}

export default RecipeAddPage; // 컴포넌트를 모듈로 내보냄
