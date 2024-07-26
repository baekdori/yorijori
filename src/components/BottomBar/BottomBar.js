import React from 'react';
import './BottomBar.css';

const BottomBar = () => {
    return (
        <div className="bottom-nav">
            <button className="nav-item">
                <img className="Category" alt="Category" src="/static/img/puzzle.png" />
            </button>
            <button className="nav-item">
            <img className="Post" alt="Post" src="/static/img/puzzle.png" />
            </button>
            <button className="nav-item">
            <img className="Home" alt="Home" src="/static/img/puzzle.png" />
            </button>
            <button className="nav-item">
            <img className="Like" alt="Like" src="/static/img/puzzle.png" />
            </button>
            <button className="nav-item">
            <img className="My Page" alt="My Page" src="/static/img/puzzle.png" />
            </button>
        </div>
    );
};

export default BottomBar;