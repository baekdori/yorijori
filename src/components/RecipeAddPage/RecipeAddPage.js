import React from 'react';
import './RecipeAddPage.css';

function RecipeAddPage() {
    return (
        <div className="recipe-add-page">
            <h1 className="recipe-title">레시피 작성</h1>
            <div className="first-line"></div>
            <div className="title-container">
                <input type="text" className="title-input" placeholder="제목 작성" />
            </div>
            <div className="second-line"></div>
            <textarea className="recipe-input" placeholder="본문 내용을 입력하세요"></textarea>
            <button className="cancel-btn">취소</button>
            <button className="submit-btn">등록</button>
        </div>
    );
}

export default RecipeAddPage;