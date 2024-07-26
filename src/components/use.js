// 게시글 보기 api
try {
    const foodIdx = 3;
    const response = await fetch(`http://localhost:4000/foods/postsee/${foodIdx}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('정보를 불러올 수 없습니다.');
    }

    const data = await response.json();
    console.log(data);
} catch (error) {
    console.error('에러 발생', error);
    alert('정보를 불러올 수 없습니다.');
}
// 게시글 수정 api
// 게시글 삭제 api